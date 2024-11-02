import * as React from "react";
import "vite/client";

interface Window {
  dataLayer: unknown[];
}

declare module "relay-runtime" {
  interface PayloadError {
    errors?: Record<string, string[] | undefined>;
  }
}

declare module "*.css";

declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}

/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_APP_NAME: string;
    readonly VITE_SOLANA_CONNECTION_URL: string;
  };
}
