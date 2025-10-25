// This file provides TypeScript definitions for Vite's environment variables.

declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_KEY: string;
      // You can add other environment variables here if needed.
    };
  }
}

// FIX: Add export {} to make this file a module and allow global augmentation.
export {};
