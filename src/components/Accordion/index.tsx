import {
  Box,
  View,
  Text,
  Icon,
  HStack,
  Pressable,
  VStack,
  Heading,
  FlatList,
  Spinner,
} from "native-base";
import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Feather } from "@expo/vector-icons";
import { InterfaceBoxProps } from "native-base/lib/typescript/components/primitives/Box";
import { Bloco } from "@components/Bloco";

export interface AccordionItemProps extends InterfaceBoxProps {
  keyExtractor: (item: any) => string;
  renderHeader: (item: any) => ReactElement;
  renderItem: (item: any) => ReactElement;
  data: any[];
  loading?: boolean;
}

export const Accordion: React.FC<AccordionItemProps> = ({
  data,
  keyExtractor,
  renderHeader,
  renderItem,
  loading,
  ...props
}) => {
  const buildTree = (dados: any[]) => {
    const tempTree = new Map();
    dados.forEach((element) => {
      tempTree.set(keyExtractor(element), element);
    });
    return tempTree;
  };

  const [currentExpanded, setCurrentExpanded] = useState(undefined);

  const [expandedTree, setExpandedTree] = useState(buildTree(data));

  const isExpanded = (item: any) => {
    return currentExpanded && keyExtractor(item) === currentExpanded;
  };

  function toggleItem(item: any) {
    if (isExpanded(item)) {
      setCurrentExpanded(undefined);
    } else {
      const keyItem = keyExtractor(item);
      setCurrentExpanded(keyItem);
    }
  }

  if (loading || !data) {
    return (
      <Bloco>
        <Spinner size={"lg"} color={"secondary.400"} />
      </Bloco>
    );
  }
  return (
    <>
      {data.map((item) => {
        return (
          <Box w={"full"} {...props} key={keyExtractor(item)}>
            <Pressable
              onPress={() => toggleItem(item)}
              w={"full"}
              bg="white"
              _pressed={{
                backgroundColor: "muted.300",
              }}
              borderRadius={5}
            >
              <HStack
                alignContent={"center"}
                alignItems={"center"}
                justifyContent={"space-between"}
                p={3}
                borderBottomColor={"gray.500"}
                borderBottomWidth={0.5}
                borderTopColor={"gray.500"}
                borderTopWidth={0.5}
              >
                <VStack>{renderHeader(item)}</VStack>
                <Icon
                  as={Feather}
                  name={isExpanded(item) ? "chevron-up" : "chevron-down"}
                  size={7}
                  color={"#bbb"}
                />
              </HStack>
            </Pressable>

            {isExpanded(item) && (
              <Box
                p={3}
                backgroundColor={"white"}
                minHeight={10}
                borderBottomColor={"gray.500"}
                borderBottomWidth={0.5}
                borderTopColor={"gray.500"}
                borderTopWidth={0.5}
              >
                {renderItem(item)}
              </Box>
            )}
          </Box>
        );
      })}
    </>
  );
};
