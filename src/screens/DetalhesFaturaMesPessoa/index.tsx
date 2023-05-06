import { useDadosComuns } from "@contexts/dadosComuns/useDadosComuns";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatarMoeda } from "@utils/util";
import {
  Avatar,
  Box,
  HStack,
  Text,
  VStack,
  ScrollView,
  Button,
} from "native-base";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DetalheFaturaPessoasScreenProp } from "src/@types/navigation";

import { Dimensions } from "react-native";
import { LogBox } from "react-native";
import { BuscarItensFatura, FaturaItem, Pessoa } from "@models/faturaItem";
import { IPagination } from "@models/pagination";
import { api } from "@utils/api";
import { Esqueleto } from "@components/Esqueleto";
import Reanimated, { FadeInDown } from "react-native-reanimated";
import { ItemLancamentoFatura } from "@components/ItemLancamentoFatura";
import { ERoutes } from "@models/routes.enum";
import { TotalMesPessoaDataset } from "@models/dadosGraficoMensal";
import { GraficoGastoMensal } from "./compontents/GraficoGastoMensal";

export const DetalhesFaturaMesPessoaScreen: React.FC = () => {
  const scrollViewRef = useRef();
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const {
    params: { resumo },
  } = useRoute<DetalheFaturaPessoasScreenProp>();
  const navigation = useNavigation();

  const {
    date: { selected, current },
  } = useDadosComuns();

  const [pager, setPager] = useState<IPagination>({
    current: 1,
    pageSize: 5,
  });
  const [lancamentos, setLancamentos] = useState<FaturaItem[]>([]);
  const [barchartData, setBarchartData] = useState<TotalMesPessoaDataset[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);

  const buscarDadosGrafico = async () => {
    try {
      setLoadingChart(true);
      const { data } = await api.get<TotalMesPessoaDataset[]>(
        `dashboard/grafico/gastos-por-pessoa/${resumo.pessoa.id}`,
        {
          params: {
            mesReferencia: selected.value.mes,
            anoReferencia: selected.value.ano,
          },
        }
      );
      setBarchartData(data);
    } finally {
      setLoadingChart(false);
    }
  };

  const buscarFaturaPessoa = async (
    pIdPessoa: number,
    page?: number,
    size?: number
  ) => {
    try {
      setLoading(true);
      const { data } = await api.get<BuscarItensFatura>(
        "faturas/buscar-itens-fatura",
        {
          params: {
            idPessoa: pIdPessoa,
            page: page ?? pager?.current,
            linesPerPage: size ?? pager?.pageSize,
            mes: current.value.mes,
            ano: current.value.ano,
          },
        }
      );
      const { itens } = data;
      setLancamentos(itens.content);

      setPager({
        current: itens.number + 1,
        pageSize: itens.size,
        total: itens.totalElements,
      });
    } catch (e) {
      setLancamentos([]);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePressItem = (faturaItem: FaturaItem) => {
    navigation.navigate(ERoutes.ROUTE_DETALHE_LANCAMENTO, {
      idLancamento: faturaItem.lancamento.id,
      compraNome: faturaItem.nome,
      faturaItem,
    });
  };

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    buscarFaturaPessoa(resumo.pessoa.id, 1, 5);
    buscarDadosGrafico();
  }, [resumo]);

  useLayoutEffect(() => {
    const screenHeight = Math.round(Dimensions.get("window").height);
    setScrollViewHeight(screenHeight - headerHeight);
  }, [headerHeight]);

  return (
    <Box>
      <VStack
        justifyContent={"center"}
        alignItems={"center"}
        alignContent={"center"}
        pt={6}
        pb={4}
        onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
      >
        <Reanimated.View entering={FadeInDown.duration(400)}>
          <HStack pt={0}>
            <Avatar
              source={{ uri: resumo?.pessoa?.perfil }}
              size={100}
              shadow={5}
            />
          </HStack>
        </Reanimated.View>

        <Text fontSize={17} fontFamily={"Inter_600SemiBold"} mt={4}>
          {resumo?.pessoa?.nome} {resumo?.pessoa?.sobrenome}
        </Text>
        <Text
          color={"muted.600"}
          fontSize={13}
          fontFamily={"heading"}
          fontWeight={"semibold"}
        >
          {formatarMoeda(resumo?.valorMesAtual)}
        </Text>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        ref={scrollViewRef}
        style={{ height: scrollViewHeight }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 150,
        }}
      >
        <VStack mt={4}>
          <Text py={3} ml={3} fontSize={16} fontFamily={"Inter_600SemiBold"}>
            Últimos meses
          </Text>
          <GraficoGastoMensal loading={loadingChart} dados={barchartData} />
        </VStack>
        <VStack mt={4}>
          <Text py={3} ml={3} fontSize={16} fontFamily={"Inter_600SemiBold"}>
            Pendências
          </Text>
          {resumo.resumos.map((item, index) => {
            return (
              <Box background={"white"} width={"full"} mb={1} key={index}>
                <HStack
                  py={4}
                  justifyContent={"space-between"}
                  mx={3}
                  key={index}
                >
                  <Text fontSize={13} fontFamily={"heading"} fontWeight={500}>
                    {item.formaPagamento.nome}
                  </Text>
                  <Text fontSize={13}>{formatarMoeda(item.valorTotal)}</Text>
                </HStack>
              </Box>
            );
          })}
        </VStack>
        <VStack mt={4}>
          <HStack
            py={3}
            mx={3}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Text fontSize={16} fontFamily={"Inter_600SemiBold"}>
              Últimos Lançamentos
            </Text>
            {/* <Icon as={Feather} name="share" size={"md"} /> */}
            <Button variant={"link"}>ver tudo</Button>
          </HStack>

          {loading ? (
            <HStack backgroundColor={"white"}>
              <Esqueleto />
            </HStack>
          ) : (
            <>
              {lancamentos.map((item) => (
                <ItemLancamentoFatura
                  item={item}
                  key={item.id}
                  onPressItem={handlePressItem}
                />
              ))}
            </>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};
