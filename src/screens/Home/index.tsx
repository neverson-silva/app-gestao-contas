import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Button,
  Center,
  StatusBar,
  useTheme,
  ScrollView,
} from "native-base";

import { SafeAreaView } from "react-native";
import { ResumoContaMes } from "./components/ResumoContaMes";
import { useAuth } from "@contexts/auth/useAuth";
import { ResumoPessoasList } from "./components/ResumoPessoasList";
import { LogBox } from "react-native";

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { logout } = useAuth();

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={colors.secondary[500]} />
      <ScrollView m={4}>
        <ResumoContaMes />
        <ResumoPessoasList />
        <Button onPress={logout}>Sair</Button>
      </ScrollView>
    </SafeAreaView>
  );
};
