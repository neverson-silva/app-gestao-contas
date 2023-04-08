import React, { useEffect } from "react";
import { View, Text, Button } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "@contexts/auth/useAuth";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { usuario, logout } = useAuth();

  useEffect(() => {
    console.log("usuario logado", usuario);
  }, [usuario]);

  return (
    <View>
      <Text>Oi Mundo Home</Text>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
};
