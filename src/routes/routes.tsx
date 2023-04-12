import { useAuth } from "@contexts/auth/useAuth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "@screens/Home";
import { LoginScreen } from "@screens/Login";
import { MainRoutes } from "./main.routes";

export const Routes = () => {
  const Stack = createNativeStackNavigator();
  const { logado } = useAuth();
  return logado ? (
    <MainRoutes />
  ) : (
    // @ts-ignore
    <Stack.Navigator>
      <Stack.Screen
        name={"Login"}
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
