import {
  Container,
  Box,
  Heading,
  Grid,
  Button,
  GridItem,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useContracts } from "../../stores/useContracts";

interface DepositNftProps {}

export const DepositNft: React.FC<DepositNftProps> = () => {
  let navigate = useNavigate();
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const core = useContracts((state) => state.core);

  const [collectionAddress, setCollectionAddress] = useState<string>();
  const [tokenId, setTokenId] = useState<string>();

  const handleDeposit = async () => {
    setIsExecuting(true);
    try {
      if (!core) {
        throw new Error("Contract failed to initialize");
      }

      if (!collectionAddress || !tokenId) {
        throw new Error("Provide valid data");
      }

      const result = await core.deposit({ value: "0" });
      result.wait(1);

      setIsExecuting(false);
      setCollectionAddress("");
      setTokenId("");
      toast.success("Sucuessfully deposited NFT");
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
      setIsExecuting(false);
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
          <Heading mb={"4"}>Deposit NFT</Heading>
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
            <Button
              w={"full"}
              h={"50px"}
              bg={"purple.400"}
              color={"white"}
              onClick={() => handleDeposit()}
              boxShadow={"sm"}
              isLoading={isExecuting}
            >
              Deposit
            </Button>
          </GridItem>
          <GridItem ml={"80px"}>
            <Box fontWeight={"bold"} fontSize={"2xl"}>
              What it does?
            </Box>
            <Box h={"5"} />
            <Box fontSize={"md"} lineHeight={"10"}>
              This will deposit your NFT in Miran Finance smart contract. It's
              required step in order to auction your NFT. Smart contract have to
              be in control over auctioned asset. When auction finishs,
              auctioned asset will be automatically given to the winner and
              payed price given to the seller.
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};
