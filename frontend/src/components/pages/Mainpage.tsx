import { Box, Button, Container, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingPageImage from "../../assets/slice1.png";
import Cart from "../../assets/illustrations/cart.svg";
import Deal from "../../assets/illustrations/deal.svg";
import Mobile from "../../assets/illustrations/mobile.svg";

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
      <Box h={"400"} />
      <Flex w="container.xl" justifyContent={"space-between"} mb={"100px"}>
        <Box
          width={"400px"}
          height={"400px"}
          bg={"white"}
          rounded={"2xl"}
          shadow={"2xl"}
          border={"1px"}
          borderColor={"gray.100"}
          paddingTop={"40px"}
          px={"30px"}
          mt={"30px"}
        >
          <Image src={Deal} h={"150px"} mx={"auto"} mb={"80px"}></Image>
          <Text
            fontSize={"7xl"}
            lineHeight={"8"}
            fontWeight={"bold"}
            color={"gray.100"}
            textAlign={"center"}
          >
            Sell
          </Text>
        </Box>
        <Box
          width={"400px"}
          height={"450px"}
          bg={"white"}
          rounded={"2xl"}
          shadow={"2xl"}
          border={"1px"}
          borderColor={"gray.100"}
          paddingTop={"40px"}
          px={"30px"}
        >
          <Image src={Mobile} h={"150px"} mx={"auto"} mb={"100px"}></Image>
          <Text
            fontSize={"7xl"}
            lineHeight={"8"}
            fontWeight={"bold"}
            color={"gray.100"}
            textAlign={"center"}
          >
            Browse
          </Text>
        </Box>
        <Box
          width={"400px"}
          height={"400px"}
          bg={"white"}
          rounded={"2xl"}
          shadow={"2xl"}
          border={"1px"}
          borderColor={"gray.100"}
          paddingTop={"40px"}
          px={"30px"}
          mt={"30px"}
        >
          <Image src={Cart} h={"150px"} mx={"auto"} mb={"80px"}></Image>
          <Text
            fontSize={"7xl"}
            lineHeight={"8"}
            fontWeight={"bold"}
            color={"gray.100"}
            textAlign={"center"}
          >
            Buy
          </Text>
        </Box>
      </Flex>
    </Container>
  );
};
