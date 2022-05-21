import { Box, Button, Container, Heading } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hethers } from "@hashgraph/hethers";
import { MIRAN_CORE } from "../../constants/contracts";
import MiranCore from "../../contracts/MiranCore.json";

interface MainpageProps {}

export const Mainpage: React.FC<MainpageProps> = () => {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <Container w="full" centerContent>
      <Box h={120} w="full" />
      <Box w="container.xl">
        <Heading size="3xl" lineHeight="1.4">
          Explore new decentralized and real-time auction house on{" "}
          <Button
            variant="link"
            size="4xl"
            textColor="purple.600"
            fontWeight="bold"
          >
            Hedera
          </Button>
        </Heading>
        <Box h={6} w="full" />
        <Button
          w="60"
          h="14"
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Explore auctions!
        </Button>
        <Box h={"20"} />
      </Box>
    </Container>
  );
};
