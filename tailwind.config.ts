import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

/**
 * Configuration object for Tailwind CSS.
 * @typedef {Object} Config
 * @property {string[]} content - An array of file paths to scan for classes.
 * @property {string} darkMode - The default dark mode setting for the application.
 * @property {Object[]} plugins - An array of plugins to use with Tailwind CSS.
 */

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  /**
   * The coloring system for the application.
   * @typedef {Object} Colors
   * @property {Object} background - The background color for the application.
   * @property {string} background.DEFAULT - The default background color.
   * @property {Object} foreground - The foreground color for the application.
   * @property {string} foreground.DEFAULT - The default foreground color.
   * @property {Object} primary - The primary color for the application.
   * @property {string} primary.DEFAULT - The default primary color.
   */

  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: {},
            foreground: {},
            primary: {},
          },
        },
        light: {
          colors: {
            background: {},
            foreground: {},
            primary: {},
          },
        },
      },
    }),
  ],
};
export default config;
