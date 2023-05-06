import { useDadosComuns } from "@contexts/dadosComuns/useDadosComuns";
import { ERoutes } from "@models/routes.enum";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DetalheLancamentoScreen } from "@screens/DetalheLancamentoScreen";
import { DetalhesFaturaMesPessoaScreen } from "@screens/DetalhesFaturaMesPessoa";
import { HomeScreen } from "@screens/Home";
import { capitalizeFirstLetter } from "@utils/util";
import { useTheme } from "native-base";
import React from "react";

const Stack = createNativeStackNavigator();

export const HomeRoutes: React.FC = () => {
  const { colors } = useTheme();
  const {
    date: { selected },
  } = useDadosComuns();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.primary[500],
        },
      }}
    >
      <Stack.Screen name={ERoutes.ROUTE_HOME} component={HomeScreen} />
      <Stack.Screen
        name={ERoutes.ROUTE_DETALHES_FATURA_PESSOA}
        component={DetalhesFaturaMesPessoaScreen}
        options={{
          headerShown: true,
          title: capitalizeFirstLetter(selected.format("MMMM [de] YYYY")),
        }}
      />
      <Stack.Screen
        name={ERoutes.ROUTE_DETALHE_LANCAMENTO}
        component={DetalheLancamentoScreen}
        options={{
          headerShown: false,
          title: "Detalhes",
        }}
      />
    </Stack.Navigator>
  );
};
