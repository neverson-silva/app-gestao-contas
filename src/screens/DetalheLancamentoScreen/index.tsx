import { AntDesign, Feather } from "@expo/vector-icons";
import { FaturaItem, FormaPagamento } from "@models/faturaItem";
import { useRoute } from "@react-navigation/native";
import { formatarData, formatarMoeda } from "@utils/util";
import { Box, HStack, Heading, VStack, Text, Icon, Fab } from "native-base";
import React, { useEffect } from "react";
import { DetalheLancamentoScreenProps } from "src/@types/navigation";

export const DetalheLancamentoScreen: React.FC = () => {
  const { params } = useRoute<DetalheLancamentoScreenProps>();
  //@ts-ignore
  const faturaItem: FaturaItem = params.faturaItem;

  function getIconName(formaPagamento: FormaPagamento): string {
    if (
      formaPagamento?.cartao === false &&
      formaPagamento?.dinheiro === false
    ) {
      return "file-text";
    }
    return faturaItem?.formaPagamento?.cartao ? "credit-card" : "dollar-sign";
  }

  return (
    <Box bgColor={"white"} height={"full"} p={3}>
      <VStack
        mt={3}
        alignItems={"center"}
        style={{
          gap: 4,
        }}
      >
        <Heading fontFamily={"heading"} fontWeight={"semibold"} fontSize={"xl"}>
          {faturaItem.lancamento.nome}
        </Heading>
        <HStack
          style={{
            gap: 2,
          }}
        >
          <Icon
            as={Feather}
            size={"sm"}
            name={getIconName(faturaItem.formaPagamento)}
          />
          <Heading
            size={"md"}
            color={"gray.600"}
            fontFamily={"heading"}
            fontWeight={"normal"}
            fontSize={"md"}
          >
            {faturaItem.formaPagamento.nome}
          </Heading>
        </HStack>
      </VStack>
      <VStack alignItems={"center"}>
        <Heading fontFamily={"heading"} fontWeight={"semibold"} fontSize={"xl"}>
          {formatarMoeda(faturaItem.valorUtilizado)}
        </Heading>
      </VStack>
      <VStack alignItems={"center"}>
        <Heading fontFamily={"heading"} fontWeight={"semibold"} fontSize={"xl"}>
          {formatarData(faturaItem.lancamento?.dataCompra)}
        </Heading>
      </VStack>

      <Fab
        renderInPortal={false}
        shadow={2}
        size="md"
        icon={<Icon color="white" as={AntDesign} name="edit" size="sm" />}
        colorScheme={"tertiary"}
      />
    </Box>
  );
};
