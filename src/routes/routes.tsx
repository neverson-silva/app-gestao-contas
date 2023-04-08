import { useAuth } from "@contexts/auth/useAuth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "@screens/Home";
import { LoginScreen } from "@screens/Login";

export const Routes = () => {
  const Stack = createNativeStackNavigator();
  const { logado } = useAuth();
  return (
    // @ts-ignore
    <Stack.Navigator>
      {logado ? (
        <Stack.Screen name={"Home"} component={HomeScreen} />
      ) : (
        <Stack.Screen
          name={"Login"}
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};
