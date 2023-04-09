import React, { useEffect } from "react";
import { View, Text, Button, Center } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "@contexts/auth/useAuth";
import { getStoredObject, storeItem } from "@utils/util";
import { STORAGE_APP_USANDO_BIOMETRIA } from "@constants/storage.constants";
import { UsuariosBiometriaDTO } from "@screens/Login";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { usuario, logout } = useAuth();

  const handleNaoUsarBio = async () => {
    const usuariosBio =
      (await getStoredObject<UsuariosBiometriaDTO>(
        STORAGE_APP_USANDO_BIOMETRIA
      )) ?? {};
    usuariosBio[usuario!.conta!] = false;
    await storeItem(STORAGE_APP_USANDO_BIOMETRIA, usuariosBio);
  };

  return (
    <View>
      <Text>Oi Mundo Home</Text>
      <Button onPress={logout}>Logout</Button>
      <Center my={12}>
        <Button onPress={handleNaoUsarBio}>Não quero usar Digital</Button>
      </Center>
    </View>
  );
};
