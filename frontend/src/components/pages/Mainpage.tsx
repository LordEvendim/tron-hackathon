import { Box, Button, Container, Image } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingPageImage from "../../assets/slice1.png";

interface MainpageProps {}

export const Mainpage: React.FC<MainpageProps> = () => {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <Container w="full" centerContent>
      <Image
        zIndex={"-1"}
        src={LandingPageImage}
        position={"absolute"}
        top={0}
        left={0}
        width={"100%"}
      ></Image>
      <Box h={460} w="full" />
      <Box w="container.xl">
        <Button
          marginLeft={"-110px"}
          fontWeight={"semibold"}
          color={"gray.600"}
          background={"white"}
          w="60"
          h="14"
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Explore auctions
        </Button>
      </Box>
    </Container>
  );
};
