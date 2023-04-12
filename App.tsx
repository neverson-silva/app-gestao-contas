import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { Routes } from "@routes/routes";
import { NativeBaseProvider, extendTheme } from "native-base";
import { AuthProvider } from "@contexts/auth/auth.provider";
import moment from "moment";
import "moment/locale/pt-br";
import { DadosComunsProvider } from "@contexts/dadosComuns/dadosComuns.provider";

moment.locale("pt-br");

export default function App() {
  const theme = extendTheme({
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
  });

  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>
        <AuthProvider>
          <DadosComunsProvider>
            <Routes />
          </DadosComunsProvider>
        </AuthProvider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
