import {authPlugin} from './auth-plugin.mjs';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const pages = process.env.VITE_GITHUB_PAGES === 'true';
const base = pages ? '/yw/' : '/';
export default defineConfig({
  base,
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [{name:'public-media-base',enforce:'pre',transform(code,id){
    if (pages && /[/\\]src[/\\].*\.[jt]sx?$/.test(id)) {
      return code.replace(/(["'])\/(photos|videos|maps)\//g, `$1${base}$2/`);
    }
  }},react(),authPlugin()],
});
