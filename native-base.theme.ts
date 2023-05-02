import { extendTheme } from "native-base";

export const theme = extendTheme({
    fontConfig: {
      Archivo: {
        400: {
          normal: "Archivo_400Regular",
        },
        500: {
          normal: "Archivo_500Medium",
        },
      },
      Inter: {
        100: {
          normal: "Inter_100Thin",
        },
        200: {
          normal: "Inter_200ExtraLight",
        },
        300: {
          normal: "Inter_300Light",
        },
        400: {
          normal: "Inter_400Regular",
        },
        500: {
          normal: "Inter_500Medium",
        },
        600: {
          normal: "Inter_600SemiBold",
        },
        700: {
          normal: "Inter_700Bold",
        },
        800: {
          normal: "Inter_800ExtraBold",
        },
        900: {
          normal: "Inter_900Black",
        },
      },
    },
    colors: {
      secondary: {
        50: "#f0fdfa",
        100: "#ccfbf1",
        200: "#99f6e4",
        300: "#5eead4",
        400: "#2dd4bf",
        500: "#14b8a6",
        600: "#0d9488",
        700: "#0f766e",
        800: "#115e59",
        900: "#134e4a",
      },
      primary: {
        50: "#f0fdf4",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d",
      },
      tertiary: {
        50: "#fff7ed",
        100: "#ffedd5",
        200: "#fed7aa",
        300: "#fdba74",
        400: "#fb923c",
        500: "#f97316",
        600: "#ea580c",
        700: "#c2410c",
        800: "#9a3412",
        900: "#7c2d12",
      },
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: "light",
    },
    fonts: {
      heading: "Inter",
      body: "Archivo",
      mono: "Inter",
    },
  });