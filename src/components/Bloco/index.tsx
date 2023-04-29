import { Box, Pressable } from "native-base";
import { InterfaceBoxProps } from "native-base/lib/typescript/components/primitives/Box";
import { InterfacePressableProps } from "native-base/lib/typescript/components/primitives/Pressable/types";
import React, { PropsWithChildren } from "react";

export const Bloco: React.FC<PropsWithChildren<InterfacePressableProps>> = ({
  children,
  ...props
}) => {
  return (
    //@ts-ignore
    <Pressable border="1" borderRadius="md" bgColor={"white"} p={4} {...props}>
      {children}
    </Pressable>
  );
};
