import React, { useEffect, useMemo, useState, useRef } from "react";
import { StatusBar, useTheme, ScrollView, Box, Button } from "native-base";

import { useAuth } from "@contexts/auth/useAuth";
import { ResumoPessoasList } from "./components/ResumoPessoasList";
import { LogBox, Animated, SafeAreaView, RefreshControl } from "react-native";
import { HomeHeader } from "./components/HomeHeader";
import { ResumoFormaPagamentosDTO } from "@models/resumosFormasPagamento";
import { api } from "@utils/api";
import { useDadosComuns } from "@contexts/dadosComuns/useDadosComuns";

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const {
    logout,
    usuario: { pessoa },
  } = useAuth();
  const {
    date: { selected, current, changeSelected },
  } = useDadosComuns();

  let scrollOffsetY = useRef(new Animated.Value(0)).current;

  const [resumoFormasPagamentos, setResumoFormasPagamentos] = useState<
    undefined | ResumoFormaPagamentosDTO
  >();
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const buscarResumoMes = async () => {
    try {
      const { data } = await api.get<ResumoFormaPagamentosDTO>(
        `dashboard/resumo-pagamentos/${pessoa.id}`,
        {
          params: {
            mesReferencia: selected.value.mes,
            anoReferencia: selected.value.ano,
          },
        }
      );
      setResumoFormasPagamentos(data);
    } catch (e) {
      console.log("erro ao buscar dados", e);
    }
  };

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const handleLoadingData = async () => {
    setLoadingBalance(true);
    await buscarResumoMes();
    setLoadingBalance(false);
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    await buscarResumoMes();
    setRefreshing(false);
  };
  useEffect(() => {
    handleLoadingData();
  }, [selected]);

  const LocalStickyHeader = useMemo(() => {
    return () => (
      <HomeHeader
        valor={resumoFormasPagamentos?.total?.valor ?? 0}
        porcentagem={resumoFormasPagamentos?.total?.porcentagem ?? 0}
        loading={loadingBalance || refreshing}
      />
    );
  }, [resumoFormasPagamentos, loadingBalance, refreshing]);

  return (
    <Box>
      <StatusBar backgroundColor={colors.primary[500]} />

      <ScrollView
        nestedScrollEnabled={true}
        style={{
          marginTop: 0,
        }}
        scrollEventThrottle={16}
        // StickyHeaderComponent={LocalStickyHeader}
        // stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefreshData}
          />
        }
      >
        <LocalStickyHeader />
        <ResumoPessoasList refreshing={refreshing} />
      </ScrollView>
    </Box>
  );

  // return (
  //   <SafeAreaView>
  //     <StatusBar backgroundColor={colors.secondary[500]} />
  //     <ScrollView m={4}>
  //       <ResumoContaMes />
  //       <ResumoPessoasList />
  //       <Button onPress={logout}>Sair</Button>
  //     </ScrollView>
  //   </SafeAreaView>
  // );
};
