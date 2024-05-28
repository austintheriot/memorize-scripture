/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BIBLE_KEY: string;
  readonly VITE_ESV_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
