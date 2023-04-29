import { useTheme } from "native-base";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "@screens/Home";

import { Feather } from "@expo/vector-icons";
import { HomeRoutes } from "./home.routes";
import { ERoutes } from "@models/routes.enum";

const Tab = createBottomTabNavigator();

export const MainRoutes: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60,
        },
        tabBarItemStyle: {
          marginBottom: 10,
          paddingBottom: 10,
          height: "100%",
        },
        tabBarActiveTintColor: colors.white,
        tabBarActiveBackgroundColor: colors.tertiary[400],
      }}
    >
      <Tab.Screen
        name={ERoutes.ROUTE_HOME_ROUTES}
        component={HomeRoutes}
        options={{
          title: "Início",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="home" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name={ERoutes.ROUTE_LANCAMENTOS}
        component={HomeScreen}
        options={{
          title: "Lançamentos",

          tabBarIcon: ({ color }) => (
            <Feather name="credit-card" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name={ERoutes.ROUTE_FATURAS}
        component={HomeScreen}
        options={{
          title: "Faturas",
          tabBarIcon: ({ color }) => (
            <Feather name="list" color={color} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
