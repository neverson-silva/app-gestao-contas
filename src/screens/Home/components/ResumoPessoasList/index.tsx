import { Esqueleto } from "@components/Esqueleto";

import { useDadosComuns } from "@contexts/dadosComuns/useDadosComuns";
import { ResumoFaturaPessoas } from "@models/resumoFatura";
import { ERoutes } from "@models/routes.enum";
import { useNavigation } from "@react-navigation/native";
import { api } from "@utils/api";
import { formatarMoeda } from "@utils/util";
import {
  Avatar,
  Box,
  FlatList,
  HStack,
  Heading,
  Spacer,
  VStack,
  View,
  Text,
  Pressable,
} from "native-base";
import React, { useEffect, useState } from "react";

type ResumoPessoaListProps = {
  refreshing?: boolean;
};

export const ResumoPessoasList: React.FC<ResumoPessoaListProps> = ({
  refreshing,
}) => {
  const [loading, setLoading] = useState(false);
  const [resumos, setResumos] = useState<ResumoFaturaPessoas[]>([]);

  const navigation = useNavigation();

  const {
    date: { selected },
  } = useDadosComuns();

  const buscarResumosPessoasPorPeriodo = async () => {
    try {
      const dataSelecionada = selected.toMoment();
      if (!dataSelecionada) {
        return;
      }

      setLoading(true);
      const { data } = await api.get("dashboard/resumo-fatura-pessoas", {
        params: {
          mesReferencia: dataSelecionada.month() + 1,
          anoReferencia: dataSelecionada.year(),
        },
      });
      setResumos(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleOnPressItem = (item: ResumoFaturaPessoas) => {
    navigation.navigate(ERoutes.ROUTE_DETALHES_FATURA_PESSOA, {
      resumo: item,
    });
  };
  useEffect(() => {
    buscarResumosPessoasPorPeriodo();
  }, [selected]);

  useEffect(() => {
    if (refreshing && selected) {
      buscarResumosPessoasPorPeriodo();
    }
  }, [refreshing]);
  return (
    <Box>
      {loading ? (
        <Esqueleto />
      ) : (
        <FlatList
          data={resumos}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleOnPressItem(item)}
              backgroundColor={"yellow"}
              width={"100%"}
            >
              {({ isPressed }) => {
                return (
                  <>
                    <Box
                      borderBottomWidth="1"
                      _dark={{
                        borderColor: "muted.50",
                      }}
                      borderBottomColor={"muted.200"}
                      //   borderColor="muted.800"
                      pl={["0", "4"]}
                      pr={["0", "5"]}
                      backgroundColor={isPressed ? "muted.200" : "white"}
                      py="3"
                      borderRadius={5}
                    >
                      <HStack
                        space={[2, 3]}
                        justifyContent="space-between"
                        px={3}
                      >
                        <Avatar
                          size="48px"
                          source={{
                            uri: item.pessoa.perfil,
                          }}
                        />
                        <VStack>
                          <Text
                            _dark={{
                              color: "warmGray.50",
                            }}
                            color="coolGray.800"
                            bold
                          >
                            {item.pessoa.nome} {item.pessoa.sobrenome}
                          </Text>
                          <Text
                            color="coolGray.600"
                            _dark={{
                              color: "warmGray.200",
                            }}
                          >
                            mês anterior {formatarMoeda(item.valorMesAnterior)}
                          </Text>
                        </VStack>
                        <Spacer />
                        <Text
                          fontSize="xs"
                          _dark={{
                            color: "warmGray.50",
                          }}
                          color="coolGray.800"
                          alignSelf="flex-start"
                        >
                          {formatarMoeda(item.valorMesAtual)}
                        </Text>
                      </HStack>
                    </Box>
                  </>
                );
              }}
            </Pressable>
          )}
          keyExtractor={(item) => item.pessoa.id.toString()}
        />
      )}
    </Box>
  );
};
