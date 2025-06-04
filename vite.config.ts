import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import UnoCSS from "unocss/vite";
import { presetIcons } from "@unocss/preset-icons";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    UnoCSS({
      presets: [
        presetIcons({
          scale: 1.2,
          cdn: "https://esm.sh/",
        }),
      ],
    }),
  ],
});
