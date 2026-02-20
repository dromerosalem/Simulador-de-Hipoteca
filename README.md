# Simulador de Hipoteca 🏠

A premium, accessible web application designed to help users—specifically seniors—calculate and visualize mortgage savings through extra capital payments.

![Simulador de Hipoteca Preview](./public/preview.png)

## 🌟 What This Does

This application provides a simple yet powerful interface for simulating mortgage scenarios. It addresses the complexity of financial planning by offering clear, visual, and audible feedback on how additional payments can significantly reduce loan terms and interest costs.

Built with a focus on **accessibility** and **transparency**, it ensures that even users who are not tech-savvy can confidently plan their financial future.

## � Live Demo

Experience the simulator live: **[simulador-de-hipoteca.vercel.app](https://simulador-de-hipoteca.vercel.app/)**

## �🛠️ Key Features

- **Accessibility-First Design**: Large, readable typography, adjustable font sizes (1x to 1.5x), and high-contrast dark mode support.
- **AI-Powered Summary**: Integrated with **Google Gemini 2.5 Flash** to provide natural-sounding Text-to-Speech (TTS) summaries of your savings.
- **Interactive Visualizations**: Dynamic charts powered by **Recharts** to track balance evolution and interest vs. principal ratios over time.
- **Flexible Extra Payments**: Simulate one-time, monthly, quarterly, semiannual, or annual extra payments to see immediate impact.
- **Detailed Amortization**: A comprehensive monthly breakdown of every payment throughout the loan's lifetime.

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (CDN)
- **Charts**: [Recharts](https://recharts.org/)
- **AI/Audio**: [Google Gemini 2.5 Flash](https://ai.google.dev/) (via `@google/genai`)
- **Language**: TypeScript

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- A Google AI (Gemini) API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Simulador-de-Hipoteca
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   VITE_API_KEY=your_gemini_api_key_here
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```

## 🧠 How It Works

The application uses a standard mortgage amortization formula to calculate monthly payments and remaining balances. What makes it unique is its integration with **Gemini's experimental TTS capabilities**:
1. It calculates the difference between a "Standard" scenario and the "Extra Payment" scenario.
2. It generates a natural language summary of the years/months saved and the total interest avoided.
3. It uses the `gemini-2.5-flash-preview-tts` model to deliver this summary audibly, ensuring accessibility for users with visual impairments.

## 📈 What I Learned

- **Designing for Seniors**: Implementing adjustable font scales and inclusive UI patterns that prioritize clarity over density.
- **Edge-Case Audio Handling**: Managing `AudioContext` lifecycle in modern browsers to comply with strict mobile autoplay policies.
- **Real-time Financial Modeling**: Building robust, performant hooks to calculate 30+ years of amortization data instantly upon any input change.

## 📄 License

Personal Project - Built with ❤️ for financial clarity.
