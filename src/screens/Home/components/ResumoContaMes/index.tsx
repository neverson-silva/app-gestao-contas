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
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  ResumoFormaPagamento,
  ResumoFormaPagamentosDTO,
} from "@models/resumosFormasPagamento";
import { useAuth } from "@contexts/auth/useAuth";
import { api } from "@utils/api";
import { DatePicker } from "@components/DatePicker";
import { Esqueleto } from "@components/Esqueleto";

export const ResumoContaMes: React.FC = () => {
  const {
    date: { selected, current, changeSelected },
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
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    buscarResumoMes();
  }, [selected]);

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
      <Box mb={6} display={"flex"} flexDirection={"row"}>
        <Box flexBasis={"80%"}>
          <Heading mb={3}>{selected.format("MMMM [de] YYYY")}</Heading>
        </Box>
        <Box
          flexBasis={"20%"}
          alignItems={"flex-end"}
          justifyContent={"center"}
        >
          <Icon
            as={Feather}
            name={"calendar"}
            size={7}
            color={"muted.700"}
            onPress={() => setShowCalendar(true)}
          />
        </Box>

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
      <DatePicker
        isOpen={showCalendar}
        onClose={() => setShowCalendar(!showCalendar)}
        mode="monthYear"
        onMonthYearChange={(selectedDate: string) => {
          const [ano, mes] = selectedDate?.split(" ");
          changeSelected(Number(mes), Number(ano));
        }}
      />
    </>
  );
};
