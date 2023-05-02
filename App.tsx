import React from "react";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import {
  Archivo_400Regular,
  Archivo_500Medium,
  useFonts as useFontsArchivo,
} from "@expo-google-fonts/archivo";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { Routes } from "@routes/routes";
import { NativeBaseProvider } from "native-base";
import { AuthProvider } from "@contexts/auth/auth.provider";
import moment from "moment";
import "moment/locale/pt-br";
import { DadosComunsProvider } from "@contexts/dadosComuns/dadosComuns.provider";

import { theme } from "native-base.theme";

moment.locale("pt-br");
moment.suppressDeprecationWarnings = true;

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const [archivoLoaded] = useFontsArchivo({
    Archivo_400Regular,
    Archivo_500Medium,
  });

  if (!fontsLoaded || !archivoLoaded) {
    return <></>;
  }

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
