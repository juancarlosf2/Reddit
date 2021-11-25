import { Box } from "@chakra-ui/core";
import React, { ReactElement, ReactNode } from "react";

export type WrapperVariant = "small" | "regular";
interface Props {
  children: ReactNode;
  variant?: WrapperVariant;
}

function Wrapper({ children, variant = "regular" }: Props): ReactElement {
  return (
    <Box
      maxW={variant === "regular" ? "50em" : "400px"}
      w="100%"
      mt={8}
      mx="auto"
    >
      {children}
    </Box>
  );
}

export default Wrapper;
