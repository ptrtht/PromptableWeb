import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {}
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        "dark": {
          "primary": "#0A84FF",
          "primary-content": "#FFFFFF",
          // D9EBFF ??
          "secondary": "#64D2FF",
          "secondary-content": "#FFFFFF",
          "accent": "#FF9F0A",
          "accent-content": "#000000",
          "neutral": "#8E8E93",
          "neutral-content": "#FFFFFF",
          "base-100": "#1C1C1E",
          "base-200": "#2C2C2E",
          "base-300": "#3A3A3C",
          "base-400": "#48484A",
          "base-500": "#636366",
          "base-600": "#8E8E93",
          "base-content": "#FFFFFF",
          "info": "#64D2FF",
          "info-content": "#000000",
          "success": "#32D74B",
          "success-content": "#000000",
          "warning": "#FFD60A",
          "warning-content": "#000000",
          "error": "#FF453A",
          "error-content": "#FFFFFF"
        },
        "light": {
          "primary": "#007AFF",
          "primary-content": "#FFFFFF",
          "secondary": "#5AC8FA",
          "secondary-content": "#FFFFFF",
          "accent": "#FF9500",
          "accent-content": "#000000",
          "neutral": "#8E8E93",
          "neutral-content": "#FFFFFF",
          "base-100": "#F2F2F7",
          "base-200": "#E5E5EA",
          "base-300": "#D1D1D6",
          "base-400": "#C7C7CC",
          "base-500": "#AEAEB2",
          "base-600": "#8E8E93",
          "base-content": "#000000",
          "info": "#5AC8FA",
          "info-content": "#000000",
          "success": "#34C759",
          "success-content": "#FFFFFF",
          "warning": "#FFCC00",
          "warning-content": "#000000",
          "error": "#FF3B30",
          "error-content": "#FFFFFF"
        },

      }
    ],
  },

}



// {
//   "DEFAULT_SYSTEM_RED_LIGHT": "#FF3B30",
//   "DEFAULT_SYSTEM_RED_DARK": "#FF453A",
//   "DEFAULT_SYSTEM_ORANGE_LIGHT": "#FF9500",
//   "DEFAULT_SYSTEM_ORANGE_DARK": "#FF9F0A",
//   "DEFAULT_SYSTEM_YELLOW_LIGHT": "#FFCC00",
//   "DEFAULT_SYSTEM_YELLOW_DARK": "#FFD60A",
//   "DEFAULT_SYSTEM_GREEN_LIGHT": "#34C759",
//   "DEFAULT_SYSTEM_GREEN_DARK": "#32D74B",
//   "DEFAULT_SYSTEM_TEAL_LIGHT": "#5AC8FA",
//   "DEFAULT_SYSTEM_TEAL_DARK": "#64D2FF",
//   "DEFAULT_SYSTEM_BLUE_LIGHT": "#007AFF",
//   "DEFAULT_SYSTEM_BLUE_DARK": "#0A84FF",
//   "DEFAULT_SYSTEM_INDIGO_LIGHT": "#5856D6",
//   "DEFAULT_SYSTEM_INDIGO_DARK": "#5E5CE6",
//   "DEFAULT_SYSTEM_PURPLE_LIGHT": "#AF52DE",
//   "DEFAULT_SYSTEM_PURPLE_DARK": "#BF5AF2",
//   "DEFAULT_SYSTEM_PINK_LIGHT": "#FF2D55",
//   "DEFAULT_SYSTEM_PINK_DARK": "#FF2D55",
//   "DEFAULT_SYSTEM_GRAY_LIGHT": "#8E8E93",
//   "DEFAULT_SYSTEM_GRAY_DARK": "#8E8E93",
//   "DEFAULT_SYSTEM_GRAY_02_LIGHT": "#AEAEB2",
//   "DEFAULT_SYSTEM_GRAY_02_DARK": "#636366",
//   "DEFAULT_SYSTEM_GRAY_03_LIGHT": "#C7C7CC",
//   "DEFAULT_SYSTEM_GRAY_03_DARK": "#48484A",
//   "DEFAULT_SYSTEM_GRAY_04_LIGHT": "#D1D1D6",
//   "DEFAULT_SYSTEM_GRAY_04_DARK": "#3A3A3C",
//   "DEFAULT_SYSTEM_GRAY_05_LIGHT": "#E5E5EA",
//   "DEFAULT_SYSTEM_GRAY_05_DARK": "#1C1C1E",
//   "DEFAULT_SYSTEM_GRAY_06_LIGHT": "#F2F2F7",
//   "DEFAULT_SYSTEM_GRAY_06_DARK": "#1C1C1E",
//   "ACCESSIBLE_SYSTEM_RED_LIGHT": "#D70015",
//   "ACCESSIBLE_SYSTEM_RED_DARK": "#FF6961",
//   "ACCESSIBLE_SYSTEM_ORANGE_LIGHT": "#C93400",
//   "ACCESSIBLE_SYSTEM_ORANGE_DARK": "#FFB340",
//   "ACCESSIBLE_SYSTEM_PINK_LIGHT": "#D30F45",
//   "ACCESSIBLE_SYSTEM_PINK_DARK": "#FF6482",
//   "ACCESSIBLE_SYSTEM_PURPLE_LIGHT": "#8944AB",
//   "ACCESSIBLE_SYSTEM_PURPLE_DARK": "#DA8FFF",
//   "ACCESSIBLE_SYSTEM_INDIGO_LIGHT": "#3634A3",
//   "ACCESSIBLE_SYSTEM_INDIGO_DARK": "#7D7AFF",
//   "ACCESSIBLE_SYSTEM_BLUE_LIGHT": "#0040DD",
//   "ACCESSIBLE_SYSTEM_BLUE_DARK": "#409CFF",
//   "ACCESSIBLE_SYSTEM_TEAL_LIGHT": "#0071A4",
//   "ACCESSIBLE_SYSTEM_TEAL_DARK": "#70D7FF",
//   "ACCESSIBLE_SYSTEM_GREEN_LIGHT": "#248A3D",
//   "ACCESSIBLE_SYSTEM_GREEN_DARK": "#30DB5B",
//   "ACCESSIBLE_SYSTEM_YELLOW_LIGHT": "#B25000",
//   "ACCESSIBLE_SYSTEM_YELLOW_DARK": "#FFD426",
//   "ACCESSIBLE_SYSTEM_GRAY_LIGHT": "#6C6C70",
//   "ACCESSIBLE_SYSTEM_GRAY_DARK": "#AEAEB2",
//   "ACCESSIBLE_SYSTEM_GRAY_02_LIGHT": "#8E8E93",
//   "ACCESSIBLE_SYSTEM_GRAY_02_DARK": "#7C7C80",
//   "ACCESSIBLE_SYSTEM_GRAY_03_LIGHT": "#AEAEB2",
//   "ACCESSIBLE_SYSTEM_GRAY_03_DARK": "#545456",
//   "ACCESSIBLE_SYSTEM_GRAY_04_LIGHT": "#BCBCC0",
//   "ACCESSIBLE_SYSTEM_GRAY_04_DARK": "#444446",
//   "ACCESSIBLE_SYSTEM_GRAY_05_LIGHT": "#D8D8DC",
//   "ACCESSIBLE_SYSTEM_GRAY_05_DARK": "#363638",
//   "ACCESSIBLE_SYSTEM_GRAY_06_LIGHT": "#EBEBF0",
//   "ACCESSIBLE_SYSTEM_GRAY_06_DARK": "#242426",
//   "LABEL_COLOR_LIGHT_PRIMARY": "#000000",
//   "LABEL_COLOR_LIGHT_SECONDARY": "#3C3C4399"
// }