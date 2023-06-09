import {
  ROUTE_DETALHES_FATURA_PESSOA,
  ROUTE_HOME,
} from "@constants/routes.constants";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DetalhesFaturaMesPessoaScreen } from "@screens/DetalhesFaturaMesPessoa";
import { HomeScreen } from "@screens/Home";
import React from "react";

const Stack = createNativeStackNavigator();

export const HomeRoutes: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={ROUTE_HOME} component={HomeScreen} />
      <Stack.Screen
        name={ROUTE_DETALHES_FATURA_PESSOA}
        component={DetalhesFaturaMesPessoaScreen}
      />
    </Stack.Navigator>
  );
};
