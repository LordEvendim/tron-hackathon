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
import { AiOutlineArrowLeft, AiOutlineConsoleSql } from "react-icons/ai";
import { BigNumber, ethers } from "ethers";
import ERC721Contract from "../../contracts/ERC721.json";
import { ERC721 } from "../../contracts/typechain/ERC721";
import { useProvider } from "../../stores/useProvider";
import { useUserData } from "../../stores/useUserData";
import { MIRAN_CORE } from "../../constants/contracts";
import { useContracts } from "../../stores/useContracts";

interface CreateProps {}

export const Create: React.FC<CreateProps> = () => {
  let navigate = useNavigate();
  const provider = useProvider((state) => state.provider);
  const userAddress = useUserData((state) => state.address);
  const miranCore = useContracts((state) => state.core);

  const [collectionAddress, setCollectionAddress] = useState<string>();
  const [tokenId, setTokenId] = useState<string>();
  const [startingPrice, setStartingPrice] = useState<string>();

  const [isCreating, setIsCreating] = useState<boolean>();
  const handleCreateAuction = async () => {
    setIsCreating(true);
    try {
      console.log("<> creating the auction <>");
      console.log(collectionAddress);
      console.log(tokenId);
      console.log(startingPrice);

      if (!collectionAddress) {
        throw new Error("Please provide the collection address");
      }

      if (!provider) {
        throw new Error("Provider is not defined");
      }

      if (!userAddress) {
        throw new Error("Please login");
      }

      if (!tokenId) {
        throw new Error("Please provide the token Id");
      }

      if (!miranCore) {
        throw new Error("Core contract is not defined");
      }

      if (!startingPrice) {
        throw new Error("Starting price is not defined");
      }

      console.log("Creating the contract code");
      const collectionContract = new ethers.Contract(
        collectionAddress,
        ERC721Contract.abi,
        provider.getSigner()
      ) as ERC721;

      console.log("Transfering the NFT");
      const result = await collectionContract.transferFrom(
        userAddress,
        MIRAN_CORE,
        tokenId
      );
      console.log(result);

      await result.wait(1);
      toast.success("NFT successfully deposited");

      const formatedPrice = ethers.utils.parseEther(startingPrice);

      const resultCreation = await miranCore.createNewAuction(
        collectionAddress,
        tokenId,
        formatedPrice
      );

      await resultCreation.wait(1);
      toast.success("Auction has been created");

      setCollectionAddress("");
      setTokenId("");
      setStartingPrice("");

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
              bg={"purple.400"}
              color={"white"}
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
