import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

export default function UserBadge({ user, handleFunction }) {
  return (
    <>
      <Box
        px={2}
        py={1}
        borderRadius={"lg"}
        m={1}
        mb={2}
        variant={"solid"}
        fontSize={12}
        bgColor="purple"
        color={"white"}
        onClick={handleFunction}
      >
        {user.name}
        <CloseIcon ml={2} />
      </Box>
    </>
  );
}
