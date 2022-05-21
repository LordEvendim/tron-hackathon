import {
  Container,
  Box,
  Heading,
  Grid,
  Button,
  Divider,
  Flex,
  GridItem,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineArrowLeft } from "react-icons/ai";

interface CreateProps {}

export const Create: React.FC<CreateProps> = () => {
  let navigate = useNavigate();

  const [collectionAddress, setCollectionAddress] = useState<string>();
  const [tokenId, setTokenId] = useState<string>();
  const [startingPrice, setStartingPrice] = useState<string>();

  const [isCreating, setIsCreating] = useState<boolean>();
  const handleCreateAuction = async () => {
    setIsCreating(true);
    try {
      // Check is contract owns NFT
      // Call contract function
      console.log(collectionAddress);
      console.log(tokenId);
      console.log(startingPrice);
      setIsCreating(false);
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
      setIsCreating(false);
    }
  };

  return (
    <Container w={"full"} centerContent>
      <Box h={"10"} />
      <Box w={"container.xl"}>
        <HStack>
          <Button
            variant={"solid"}
            mr={"5px"}
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            <AiOutlineArrowLeft></AiOutlineArrowLeft>
          </Button>
          <Heading mb={"4"}>Create Auction</Heading>
        </HStack>
        <Box h={"12"} />
        <Grid templateColumns="repeat(2, 1fr)" gap={12}>
          <GridItem>
            <Text ml={2} mb={1} fontSize={"sm"}>
              Collection Address
            </Text>
            <Input
              backgroundColor={"white"}
              mb={6}
              onChange={(event) => {
                setCollectionAddress(event.target.value);
              }}
            ></Input>
            <Text ml={2} mb={1} fontSize={"sm"}>
              NFT Id
            </Text>
            <Input
              backgroundColor={"white"}
              mb={6}
              onChange={(event) => {
                setTokenId(event.target.value);
              }}
            ></Input>
            <Text ml={2} mb={1} fontSize={"sm"}>
              Starting price
            </Text>
            <Input
              backgroundColor={"white"}
              mb={6}
              onChange={(event) => {
                setStartingPrice(event.target.value);
              }}
            ></Input>
            <Button
              w={"full"}
              h={"50px"}
              onClick={handleCreateAuction}
              boxShadow={"sm"}
              isLoading={isCreating}
            >
              Create
            </Button>
          </GridItem>
          <GridItem ml={"80px"}>
            <HStack spacing={"30px"}>
              <Flex
                justify={"center"}
                align={"center"}
                rounded={"full"}
                width={"50px"}
                height={"50px"}
                bg={"transparent"}
                textAlign={"center"}
                border={"1px"}
                borderColor={"gray.500"}
              >
                <Text fontSize={"xl"} mb={"4px"}>
                  1
                </Text>
              </Flex>
              <Text>Provide valid data</Text>
            </HStack>
            <Divider
              orientation="vertical"
              ml={"25px"}
              mt={"10px"}
              mb={"10px"}
              height={"90px"}
              borderColor={"gray.500"}
            />
            <HStack spacing={"30px"}>
              <Flex
                justify={"center"}
                align={"center"}
                rounded={"full"}
                width={"50px"}
                height={"50px"}
                bg={"transparent"}
                textAlign={"center"}
                border={"1px"}
                borderColor={"gray.500"}
              >
                <Text fontSize={"xl"} mb={"4px"}>
                  2
                </Text>
              </Flex>
              <Text>Sign the transaction</Text>
            </HStack>
            <Divider
              orientation="vertical"
              ml={"25px"}
              mt={"10px"}
              mb={"10px"}
              height={"90px"}
              borderColor={"gray.500"}
            />
            <HStack spacing={"30px"}>
              <Flex
                justify={"center"}
                align={"center"}
                rounded={"full"}
                width={"50px"}
                height={"50px"}
                bg={"transparent"}
                textAlign={"center"}
                border={"1px"}
                borderColor={"gray.500"}
              >
                <Text fontSize={"xl"} mb={"4px"}>
                  3
                </Text>
              </Flex>
              <Text>Let users fight for your NFT!</Text>
            </HStack>
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};
