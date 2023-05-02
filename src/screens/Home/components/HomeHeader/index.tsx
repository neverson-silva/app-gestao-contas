import React, { useState } from "react";
import { Text, Box, HStack, Heading, Icon, VStack, Spinner } from "native-base";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@contexts/auth/useAuth";
import { Bloco } from "@components/Bloco";
import { formatarMoeda } from "@utils/util";
import { useDadosComuns } from "@contexts/dadosComuns/useDadosComuns";
import { DatePicker } from "@components/DatePicker";

type HomeHeaderProps = {
  valor: number;
  porcentagem: number;
  loading: boolean;
};
export const HomeHeader: React.FC<HomeHeaderProps> = ({
  valor,
  porcentagem,
  loading,
}) => {
  const {
    usuario: { pessoa },
  } = useAuth();

  const {
    date: { selected, changeSelected },
  } = useDadosComuns();

  const [showCalendar, setShowCalendar] = useState(false);

  const getIconResumo = (pPorcentagem: number) => {
    return pPorcentagem == 0
      ? "check"
      : pPorcentagem > 0
      ? "thumbs-down"
      : "thumbs-up";
  };

  const getIconColorResumo = (pPorcentagem: number) => {
    return pPorcentagem == 0
      ? "muted.500"
      : pPorcentagem > 0
      ? "danger.500"
      : "success.500";
  };

  return (
    <>
      <Box bg={"primary.500"} height={120} mb={55}>
        <Box width={"100%"} p={4}>
          <HStack justifyContent={"space-between"}>
            <Box>
              <Heading size={"md"} color={"white"} fontFamily={"heading"}>
                {pessoa?.nome}
              </Heading>
            </Box>
            <Box>
              <Pressable onPress={() => setShowCalendar((old) => !old)}>
                <Icon as={Feather} name="calendar" size={7} color={"white"} />
              </Pressable>
            </Box>
          </HStack>
        </Box>
        <Box px={3} position={"absolute"} width={"full"} top={70}>
          <Bloco
            borderRadius="md"
            bgColor={"white"}
            p={4}
            minHeight={90}
            shadow={2}
            _pressed={{
              backgroundColor: "muted.100",
            }}
          >
            {loading ? (
              <Spinner size={"lg"} mt={2} color={"secondary.500"} />
            ) : (
              <HStack justifyContent={"space-between"} px={2}>
                <VStack>
                  <Text mb={1}>Gastos</Text>
                  <Heading fontFamily={"heading"} size={"md"}>
                    {formatarMoeda(valor)}
                  </Heading>
                </VStack>
                <VStack
                  justifyContent={"flex-end"}
                  alignContent={"flex-end"}
                  alignItems={"flex-end"}
                  ml={45}
                  pl={30}
                >
                  <HStack space={2} pl={4}>
                    <Icon
                      as={Feather}
                      name={getIconResumo(porcentagem)}
                      size={5}
                      color={getIconColorResumo(porcentagem)}
                    />
                    <Heading
                      fontFamily={"heading"}
                      size={"md"}
                      color={getIconColorResumo(porcentagem)}
                    >
                      {porcentagem.toFixed(2).replace(".", ",")} %
                    </Heading>
                  </HStack>
                </VStack>
              </HStack>
            )}
          </Bloco>
        </Box>
      </Box>
      <DatePicker
        isOpen={showCalendar}
        onClose={() => setShowCalendar(!showCalendar)}
        mode="monthYear"
        current={selected.toDate()}
        onMonthYearChange={(selectedDate: string) => {
          const [ano, mes] = selectedDate?.split(" ");
          changeSelected(Number(mes), Number(ano));
        }}
      />
    </>
  );
};
