import { GoogleGenAI, Modality } from '@google/genai';

// --- Audio Context Management ---
// A single AudioContext is created and reused to handle mobile browser autoplay policies.
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        // Using `any` for `webkitAudioContext` to support older browsers.
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) {
            throw new Error("Web Audio API is not supported in this browser.");
        }
        audioContext = new AudioContext({ sampleRate: 24000 });
    }
    return audioContext;
}

/**
 * Unlocks the audio context and "primes" it by playing a silent sound.
 * This must be called from within a user gesture (e.g., a click event)
 * to comply with browser autoplay policies, especially on mobile.
 */
export function unlockAudio(): void {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
            // Play a silent sound to "prime" the audio context. This is a common
            // workaround for iOS Safari's strict autoplay policies.
            const buffer = ctx.createBuffer(1, 1, 22050); // 1 frame is enough
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(0);
        }).catch(err => console.error("AudioContext resume failed:", err));
    }
}


// These functions are self-contained here to avoid external dependencies.
function decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


export async function speakText(text: string): Promise<void> {
    // As requested, using Vite's environment variable for the API key.
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey) {
        // This error will appear in the browser's console if the API_KEY is not set.
        throw new Error("API key is not configured. Please ensure the VITE_API_KEY environment variable is set.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, // A pleasant, clear voice
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data received from API.");
    }
    
    const outputAudioContext = getAudioContext();
    
    // Ensure context is running, as it might have been suspended again.
    if (outputAudioContext.state === 'suspended') {
        await outputAudioContext.resume();
    }

    const decodedBytes = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(
        decodedBytes,
        outputAudioContext,
        24000,
        1,
    );

    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContext.destination);
    source.start();

    return new Promise((resolve) => {
        source.onended = () => {
            // Do not close the shared audio context.
            resolve();
        };
    });
}