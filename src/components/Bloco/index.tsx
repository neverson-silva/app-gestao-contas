import { Box } from "native-base";
import { InterfaceBoxProps } from "native-base/lib/typescript/components/primitives/Box";
import React, { PropsWithChildren } from "react";

export const Bloco: React.FC<PropsWithChildren<InterfaceBoxProps>> = ({
  children,
  ...props
}) => {
  return (
    //@ts-ignore
    <Box border="1" borderRadius="md" bgColor={"white"} p={4} {...props}>
      {children}
    </Box>
  );
};
