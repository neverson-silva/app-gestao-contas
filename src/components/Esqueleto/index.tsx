import { Center, HStack, Skeleton, VStack } from "native-base";
import React from "react";

export const Esqueleto: React.FC = () => {
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
