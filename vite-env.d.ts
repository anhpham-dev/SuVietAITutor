/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ADMIN_EMAIL: string;
    readonly VITE_GEMINI_API_KEY: string;
    readonly VITE_VEO_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
