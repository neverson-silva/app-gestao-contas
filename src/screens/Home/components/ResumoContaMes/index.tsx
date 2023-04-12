import { Bloco } from "@components/Bloco";
import { useDadosComuns } from "@contexts/dadosComuns/useDadosComuns";
import { formatarMoeda } from "@utils/util";
import {
  Center,
  VStack,
  Text,
  Heading,
  HStack,
  Divider,
  Box,
  Skeleton,
  Icon,
  Flex,
  Stack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  ResumoFormaPagamento,
  ResumoFormaPagamentosDTO,
} from "@models/resumosFormasPagamento";
import { useAuth } from "@contexts/auth/useAuth";
import { api } from "@utils/api";

export const ResumoContaMes: React.FC = () => {
  const {
    date: { selected, current },
  } = useDadosComuns();
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();
  const [resumoFormasPagamentos, setResumoFormasPagamentos] = useState<
    undefined | ResumoFormaPagamentosDTO
  >();

  const buscarResumoMes = async () => {
    try {
      setLoading(true);

      const { data } = await api.get<ResumoFormaPagamentosDTO>(
        `dashboard/resumo-pagamentos/${usuario?.pessoa.id}`,
        {
          params: {
            mesReferencia: selected.value.mes,
            anoReferencia: selected.value.ano,
          },
        }
      );
      setResumoFormasPagamentos(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const getIconResumo = (porcentagem: number) => {
    return porcentagem == 0
      ? "check"
      : porcentagem > 0
      ? "thumbs-down"
      : "thumbs-up";
  };

  const getIconColorResumo = (porcentagem: number) => {
    return porcentagem == 0
      ? "muted.500"
      : porcentagem > 0
      ? "danger.500"
      : "success.500";
  };

  useEffect(() => {
    buscarResumoMes();
  }, [selected]);

  const Esqueleto = () => {
    return (
      <Center w="100%">
        <HStack
          w="100%"
          borderWidth="1"
          space={8}
          rounded="md"
          _dark={{
            borderColor: "coolGray.500",
          }}
          _light={{
            borderColor: "coolGray.200",
          }}
          p="4"
        >
          <Skeleton flex="1" h="150" rounded="md" startColor="coolGray.100" />
          <VStack flex="10" space="4">
            <Skeleton startColor="primary.300" />
            <Skeleton.Text />
            <HStack space="2" alignItems="center">
              <Skeleton size="5" rounded="full" />
              <Skeleton h="3" flex="2" rounded="full" />
              <Skeleton h="3" flex="1" rounded="full" startColor="indigo.300" />
            </HStack>
          </VStack>
        </HStack>
      </Center>
    );
  };

  const InfoCard: React.FC<{ resumo: ResumoFormaPagamento }> = ({
    resumo: { porcentagem, valor, titulo },
  }) => {
    return (
      <Box>
        <Box display={"flex"} flexDirection={"row"}>
          <Box flexBasis={"65%"}>
            <Text color={"muted.800"} alignSelf={"flex-start"}>
              {titulo}
            </Text>
          </Box>
          <Box flexBasis={"35%"} alignItems={"flex-end"}>
            <Icon
              as={Feather}
              name={getIconResumo(porcentagem)}
              size={5}
              color={getIconColorResumo(porcentagem)}
              mr={1}
            />
          </Box>
        </Box>
        <Box display={"flex"} flexDirection={"row"}>
          <Box flexBasis={"65%"}>
            <Text fontWeight={"bold"} fontSize={18}>
              {formatarMoeda(valor)}
            </Text>
          </Box>

          <Box
            flexBasis={"35%"}
            alignItems={"flex-end"}
            justifyContent={"center"}
          >
            <Text fontSize={14} mr={1}>
              {porcentagem}%
            </Text>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box mb={6}>
        <Heading mb={3}>{selected.format("MMMM [de] YYYY")}</Heading>
        <Divider color={"muted.00"} />
      </Box>
      <Box mb={4}>
        {loading || !!!resumoFormasPagamentos ? (
          <Esqueleto />
        ) : (
          <>
            <VStack width={"full"} mb={2}>
              <HStack width={"full"}>
                <Bloco width={"49%"} shadow={2}>
                  <InfoCard resumo={resumoFormasPagamentos.cartao} />
                </Bloco>
                <Bloco width={"50%"} ml={2}>
                  <InfoCard resumo={resumoFormasPagamentos.parcelado} />
                </Bloco>
              </HStack>
            </VStack>
            <VStack>
              <HStack>
                <Bloco width={"49%"}>
                  <InfoCard resumo={resumoFormasPagamentos.dinheiro} />
                </Bloco>
                <Bloco width={"50%"} ml={2}>
                  <InfoCard resumo={resumoFormasPagamentos.total} />
                </Bloco>
              </HStack>
            </VStack>
          </>
        )}
      </Box>
    </>
  );
};
