import { Feather } from "@expo/vector-icons";
import { FaturaItem } from "@models/faturaItem";
import { formatarMoeda, formatarData } from "@utils/util";
import { Box, HStack, Icon, Pressable, Text, VStack } from "native-base";
import React from "react";

type ItemLancamentoFaturaProps = {
  item: FaturaItem;
  onPressItem: (item: FaturaItem) => void;
};

export const ItemLancamentoFatura: React.FC<ItemLancamentoFaturaProps> = ({
  item,
  onPressItem,
}) => {
  return (
    <Pressable
      bg={"white"}
      key={item.id}
      pl={4}
      py={3}
      width={"100%"}
      mb={1}
      onPress={() => onPressItem(item)}
      _pressed={{
        backgroundColor: "muted.100",
      }}
    >
      <Box
        display={"flex"}
        flexDir={"row"}
        backgroundColor={"red"}
        width={"full"}
      >
        <Box flexDir={"column"} flexBasis={"60%"} width={"full"}>
          <Text fontWeight={"500"} fontFamily={"heading"}>
            {item.nome}
          </Text>
          <Text fontSize={12} color={"gray.700"}>
            {formatarData(item.lancamento.dataCompra)}
          </Text>
        </Box>
        <Box
          flexDir={"column"}
          flexBasis={"34%"}
          width={"full"}
          justifyContent={"flex-end"}
          alignItems={"flex-end"}
          px={4}
        >
          <Text fontWeight={"500"}>{formatarMoeda(item.valorUtilizado)}</Text>
          <Text>
            {item.parcelado
              ? `em ${item.lancamento.quantidadeParcelas} vezes`
              : "à vista"}
          </Text>
        </Box>
        <Box justifyContent={"center"} flexBasis={"6%"} width={"full"} pr={4}>
          <Icon as={Feather} name="chevron-right" size="sm" />
        </Box>
      </Box>
    </Pressable>
  );
};
