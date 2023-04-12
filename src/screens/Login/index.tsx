import React, { useEffect, useState } from "react";
import {
  Text,
  StatusBar,
  useTheme,
  VStack,
  Center,
  Heading,
  FormControl,
  Input,
  WarningOutlineIcon,
  Button,
  Icon,
  Pressable,
  AlertDialog,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { AutenticacaoDTO } from "./form/autenticacao.dto";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@contexts/auth/useAuth";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { getStoredItem, getStoredObject, storeItem } from "@utils/util";
import { STORAGE_APP_USANDO_BIOMETRIA } from "@constants/storage.constants";
import { STORAGE_APP_USERNAME } from "@constants/storage.constants";
import { STORAGE_APP_PASSWORD } from "@constants/storage.constants";

export class UsuariosBiometriaDTO {
  [prop: string]: boolean;
}

const resolver = classValidatorResolver(AutenticacaoDTO);

export const LoginScreen: React.FC = () => {
  const { colors } = useTheme();
  const { login, logado } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AutenticacaoDTO>({ resolver });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [isBiometricWarningOpen, setIsBiometricWarningOpen] = useState(false);
  const onClose = () => setIsBiometricWarningOpen(false);
  const cancelRef = React.useRef(null);

  const [credenciais, setCredenciais] = useState<any>({});

  const handleOnSubmit = async (data: AutenticacaoDTO) => {
    try {
      setLoading(true);

      const estaUsandoBiometria = await usuarioUtilizaBiometria(data.email);

      const biometriaDisponivel =
        (await isLocalAuthAvailable()) && (await hasFacialOrFingerprintSaved());

      const emailDiferente =
        (await getStoredItem(STORAGE_APP_USERNAME)) !== data.email;

      if (
        (!estaUsandoBiometria && biometriaDisponivel) ||
        (biometriaDisponivel && emailDiferente && !logado)
      ) {
        setCredenciais({ ...data });
        setIsBiometricWarningOpen(true);
        setLoading(false);

        return;
      } else {
        await login(data.email, data.senha);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const isLocalAuthAvailable = async () =>
    await LocalAuthentication.hasHardwareAsync();

  const hasFacialOrFingerprintSaved = async () =>
    await LocalAuthentication.isEnrolledAsync();

  const usuarioUtilizaBiometria = async (pEmail?: string): Promise<boolean> => {
    const usuariosBiometria = await getStoredObject<UsuariosBiometriaDTO>(
      STORAGE_APP_USANDO_BIOMETRIA
    );

    //@ts-ignore
    return (
      usuariosBiometria &&
      //@ts-ignore
      (usuariosBiometria[pEmail] === "true" ||
        usuariosBiometria[pEmail] == true)
    );
  };

  const handleLocalAuthentication = async () => {
    const estaUsandoBiometria = await usuarioUtilizaBiometria(
      await getStoredItem(STORAGE_APP_USERNAME)
    );

    const biometriaDisponivel =
      (await isLocalAuthAvailable()) && (await hasFacialOrFingerprintSaved());

    if (estaUsandoBiometria && biometriaDisponivel && !logado) {
      setLoading(true);

      const { success } = await LocalAuthentication.authenticateAsync({
        cancelLabel: "Cancelar",
        promptMessage: "Acesse sua conta com biometria",
      });

      if (success) {
        const email = await getStoredItem(STORAGE_APP_USERNAME);
        const senha = await getStoredItem(STORAGE_APP_PASSWORD);
        await login(email!, senha!);
      }
      setLoading(false);
    }
  };

  const initializeForm = async () => {
    const email = await getStoredItem(STORAGE_APP_USERNAME);

    if (!!email) {
      setValue("email", email);
    }
  };

  const handleLoginComBiometria = async (pEmail: string, pSenha: string) => {
    setLoading(true);
    const { success } = await LocalAuthentication.authenticateAsync({
      cancelLabel: "Cancelar",
      promptMessage: "Acesse sua conta com biometria",
    });

    if (success) {
      await login(pEmail, pSenha);
      await storeItem(STORAGE_APP_USERNAME, pEmail);
      await storeItem(STORAGE_APP_PASSWORD, pSenha);

      const usuariosBiometria =
        (await getStoredObject<UsuariosBiometriaDTO>(
          STORAGE_APP_USANDO_BIOMETRIA
        )) ?? {};
      usuariosBiometria[pEmail] = true;

      await storeItem(STORAGE_APP_USANDO_BIOMETRIA, usuariosBiometria);
    }
    setLoading(false);
  };

  const handleLoginSemBiometria = async (pEmail: string, pSenha: string) => {
    const usuariosBiometria =
      (await getStoredObject<UsuariosBiometriaDTO>(
        STORAGE_APP_USANDO_BIOMETRIA
      )) ?? {};

    usuariosBiometria[pEmail] = false;

    await login(pEmail, pSenha);

    await storeItem(STORAGE_APP_USANDO_BIOMETRIA, usuariosBiometria);
  };

  useEffect(() => {
    initializeForm();
    handleLocalAuthentication();
    setCredenciais({});
  }, []);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={colors.secondary[600]} />
      <VStack height={"100%"}>
        <Center>
          <Heading mt={40} mb={38}>
            Gerencia suas <Text color="emerald.500">contas</Text> com este app
          </Heading>
        </Center>
        <Center w={"100%"} mb={0}>
          <FormControl isInvalid={!!errors.email} w={"90%"}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <>
                  <FormControl.Label>Email</FormControl.Label>
                  <Input
                    placeholder="Digite seu email"
                    size={"lg"}
                    onChangeText={onChange}
                    value={value}
                    backgroundColor={"white"}
                    InputLeftElement={
                      <Icon
                        as={MaterialIcons}
                        name={"person"}
                        size={22}
                        ml={2}
                      />
                    }
                  />
                  {errors?.email && (
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors?.email?.message}
                    </FormControl.ErrorMessage>
                  )}
                </>
              )}
            />
          </FormControl>
          <FormControl w={"90%"} isInvalid={!!errors.senha} mt={5}>
            <Controller
              control={control}
              name="senha"
              render={({ field: { onChange, value } }) => (
                <>
                  <FormControl.Label>Senha</FormControl.Label>
                  <Input
                    placeholder="Digite sua senha"
                    onChangeText={onChange}
                    value={value}
                    size={"lg"}
                    backgroundColor={"white"}
                    type={showPassword ? "text" : "password"}
                    InputLeftElement={
                      <Icon as={MaterialIcons} name={"lock"} size={22} ml={2} />
                    }
                    InputRightElement={
                      <Pressable mr={2}>
                        <Icon
                          as={Feather}
                          name={showPassword ? "eye-off" : "eye"}
                          size={22}
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      </Pressable>
                    }
                  />
                  {errors?.senha && (
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors?.senha?.message}
                    </FormControl.ErrorMessage>
                  )}
                </>
              )}
            />
          </FormControl>
        </Center>

        <Center>
          <Button
            size={50}
            fontSize={"lg"}
            width={"90%"}
            mt={8}
            onPress={handleSubmit(handleOnSubmit)}
            isLoading={loading}
          >
            Login
          </Button>
        </Center>
      </VStack>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isBiometricWarningOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Autenticar com Biometria</AlertDialog.Header>
          <AlertDialog.Body>
            Identificamos que seu dispositivo possui sensor de impressão
            digital, gostaria de utilizá-lo para acessar sua conta?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() =>
                  handleLoginSemBiometria(credenciais.email, credenciais.senha)
                }
                ref={cancelRef}
              >
                NÃO
              </Button>
              <Button
                colorScheme="success"
                minW={20}
                onPress={() =>
                  handleLoginComBiometria(credenciais.email, credenciais.senha)
                }
              >
                SIM
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      {/* <VStack
        height={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignContent={"center"}
        alignItems={"center"}
      >
        <Center mb={8}>
          <Heading>
            Gerencia suas <Text color="emerald.500">contas</Text> com este app
          </Heading>
        </Center>
        <Center w={"100%"} mb={0}>
          <FormControl isInvalid w={"90%"}>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              placeholder="Digite seu email"
              size={"lg"}
              {...register("email")}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Try different from previous passwords.
            </FormControl.ErrorMessage>

            <FormControl.Label>Senha</FormControl.Label>
            <Input
              placeholder="Digite sua senha"
              size={"lg"}
              {...register("email")}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Try different from previous passwords.
            </FormControl.ErrorMessage>
          </FormControl>
        </Center>

        <Button onPress={handleOnSubmit}>Login</Button>
      </VStack> */}
    </SafeAreaView>
  );
};
