import React from "react";
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
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { AutenticacaoDTO } from "./form/autenticacao.dto";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@contexts/auth/useAuth";

const resolver = classValidatorResolver(AutenticacaoDTO);

export const LoginScreen: React.FC = () => {
  const { colors } = useTheme();
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AutenticacaoDTO>({ resolver });

  const handleOnSubmit = async (data: AutenticacaoDTO) => {
    try {
      await login(data.email, data.senha);
    } catch (e) {
      console.log("aqui no erro", e);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={colors.secondary[600]} />
      <VStack height={"100%"}>
        <Center>
          <Heading my={24}>
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
          >
            Login
          </Button>
        </Center>
      </VStack>

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
