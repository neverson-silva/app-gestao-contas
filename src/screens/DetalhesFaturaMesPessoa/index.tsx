import { useDadosComuns } from "@contexts/dadosComuns/useDadosComuns";
import { useNavigation, useRoute } from "@react-navigation/native";
import { beautyNumber, formatarData, formatarMoeda } from "@utils/util";
import {
  Avatar,
  Box,
  HStack,
  Text,
  VStack,
  Icon,
  ScrollView,
  SectionList,
  FlatList,
  Spinner,
  Divider,
  Pressable,
} from "native-base";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DetalheFaturaPessoasScreenProp } from "src/@types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { Animated } from "react-native";
import { LogBox } from "react-native";
import { BuscarItensFatura, FaturaItem, Pessoa } from "@models/faturaItem";
import { IPagination } from "@models/pagination";
import { api } from "@utils/api";
import { Esqueleto } from "@components/Esqueleto";

export const DetalhesFaturaMesPessoaScreen: React.FC = () => {
  const {
    params: { resumo },
  } = useRoute<DetalheFaturaPessoasScreenProp>();
  const navigation = useNavigation();

  const {
    date: { selected },
  } = useDadosComuns();

  const [pager, setPager] = useState<IPagination>({
    current: 1,
    pageSize: 10,
  });
  const [lancamentos, setLancamentos] = useState<FaturaItem[]>([]);

  const [loading, setLoading] = useState(false);

  let scrollOffsetY = useRef(new Animated.Value(0)).current;

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
            mes: selected.value.mes,
            ano: selected.value.ano,
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
      // notification.error({
      //   description: "Ocorreu um erro",
      //   message: "Tente novamente mais tarde",
      // });
    } finally {
      setLoading(false);
    }
  };

  const getNomeLancamento = (faturaItem: FaturaItem) => {
    if (faturaItem.parcelado) {
      return `${faturaItem.nome} - ${beautyNumber(
        faturaItem.parcela?.numero
      )}/${beautyNumber(faturaItem.lancamento.quantidadeParcelas)}`;
    }
    return faturaItem.lancamento.nome;
  };

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    buscarFaturaPessoa(resumo.pessoa.id, 1, 5);
  }, [resumo]);

  const LocalStickyHeader = useMemo(() => {
    return () => {
      return (
        <VStack
          justifyContent={"center"}
          alignItems={"center"}
          alignContent={"center"}
          // p={4}
        >
          <HStack pt={0}>
            <Avatar
              source={{ uri: resumo.pessoa.perfil }}
              size={120}
              shadow={5}
            />
          </HStack>
          <Text fontSize={19} fontFamily={"Inter_600SemiBold"} mt={4}>
            {resumo.pessoa.nome} {resumo.pessoa.sobrenome}
          </Text>
          <Text color={"muted.600"}>
            {formatarMoeda(resumo.valorMesAtual)} em{" "}
            {selected.format("MMMM [de] YYYY")}
          </Text>
        </VStack>
      );
    };
  }, [resumo]);

  return (
    <Box>
      <Icon
        as={Ionicons}
        name="ios-arrow-back"
        size={35}
        color={"primary.500"}
        m={2}
        mb={0}
        alignSelf={"flex-start"}
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        StickyHeaderComponent={LocalStickyHeader}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
      >
        <></>
        <VStack mt={4}>
          <Text py={3} ml={3} fontSize={16} fontFamily={"Inter_600SemiBold"}>
            Pendências
          </Text>
          <Box background={"white"} width={"full"}>
            {resumo.resumos.map((res, index) => {
              return (
                <HStack
                  borderBottomColor={"muted.400"}
                  borderBottomWidth={
                    index + 1 === resumo.resumos.length ? 0 : 0.3
                  }
                  py={4}
                  justifyContent={"space-between"}
                  mx={3}
                  key={index}
                >
                  <Text fontSize={13}>{res.formaPagamento.nome}</Text>
                  <Text fontSize={13}>{formatarMoeda(res.valorTotal)}</Text>
                </HStack>
              );
            })}
          </Box>
        </VStack>
        <VStack mt={4}>
          <Text py={3} ml={3} fontSize={16} fontFamily={"Inter_600SemiBold"}>
            Lançamentos
          </Text>

          {loading ? (
            <HStack backgroundColor={"white"}>
              <Esqueleto />
            </HStack>
          ) : (
            <FlatList
              data={lancamentos}
              keyExtractor={(item: FaturaItem, index) => String(index)}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    bg={"white"}
                    px={4}
                    py={3}
                    display={"flex"}
                    mb={1}
                    onPress={() => console.log(item)}
                  >
                    <HStack justifyContent={"space-between"}>
                      <Text fontWeight={"500"}>{item.nome}</Text>
                      <Text fontWeight={"500"}>
                        {formatarMoeda(item.valorUtilizado)}
                      </Text>
                    </HStack>
                    <HStack justifyContent={"space-between"}>
                      <Text fontSize={12} color={"gray.700"}>
                        {formatarData(item.lancamento.dataCompra)}
                      </Text>
                      <Text>
                        {item.parcelado
                          ? `em ${item.lancamento.quantidadeParcelas} vezes`
                          : "à vista"}
                      </Text>
                    </HStack>
                  </Pressable>
                );
              }}
            />
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};
