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
  Image,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useContracts } from "../../stores/useContracts";
import { BigNumber, ethers } from "ethers";
import faker from "@faker-js/faker";
import SampleApe from "../../assets/sample-ape.jpg";
import { truncateAddress } from "../../helpers/truncateAddress";
import ERC721Contract from "../../contracts/ERC721.json";
import { ERC721 } from "../../contracts/typechain/ERC721";

interface WithdrawProps {}

interface TokenDetails {
  index: BigNumber;
  collectionAddress: string;
  tokenId: BigNumber;
}

export const WIthdraw: React.FC<WithdrawProps> = () => {
  let navigate = useNavigate();
  const core = useContracts((state) => state.core);

  const [amount, setAmount] = useState<string>();
  const [isExecuting, setIsExecuting] = useState<boolean>();
  const [userTokens, setUserTokens] = useState<TokenDetails[]>();
  const [userBalance, setUserBalance] = useState<string>("-");

  const handleWithdrawal = async () => {
    setIsExecuting(true);
    try {
      if (!core) {
        throw new Error("Contract failed to initialize");
      }

      if (!amount) {
        throw new Error("Provide transaction amount");
      }

      const value = ethers.utils.parseEther(amount);

      if (!value) {
        throw new Error("Provide valid amount");
      }

      const result = await core.withdraw(value);
      result.wait(1);

      setIsExecuting(false);
      setAmount("");
      toast.success("Sucuessfully deposited TRON");
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
      setIsExecuting(false);
    }
  };

  const handleWithdrawToken = async (
    collectionAddress: string,
    tokenId: BigNumber
  ) => {
    try {
      if (!core) {
        throw new Error("Contract failed to initialize");
      }

      const result = await core.withdrawToken(collectionAddress, tokenId);
      await result.wait(1);

      toast.success("Successfully withdrawn token");
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!core) {
          throw new Error("Core contract is not initialized");
        }

        // get user tokens
        const result = await core.getUserTokens();
        setUserTokens(result);

        const balance = await core.getUserBalance();
        setUserBalance(ethers.utils.formatEther(balance));
      } catch (error: any) {
        if (error instanceof Error) {
          toast.error(error.message);
        }

        console.log(error);
      }
    };

    fetch();
  }, [core]);

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
          <Heading mb={"4"}>Withdraw</Heading>
        </HStack>
        <Box h={"12"} />
        <Grid templateColumns="repeat(3, 1fr)" gap={12}>
          <GridItem colSpan={1}>
            <Text fontWeight={"bold"} fontSize={"2xl"} mb={"20px"}>
              Liquidity
            </Text>
            <GridItem
              height={"350px"}
              background={"white"}
              borderRadius={"lg"}
              borderColor={"gray.200"}
              boxShadow={"lg"}
              padding={"20px"}
            >
              <Text fontSize={"sm"}>Available balance:</Text>
              <Text fontSize={"2xl"} fontWeight={"bold"} mb={"30px"}>
                {userBalance} TRN
              </Text>
              <Text ml={2} mb={1}>
                Withdraw amount
              </Text>
              <Input
                backgroundColor={"white"}
                mb={6}
                onChange={(event) => {}}
              ></Input>
              <Button
                w={"full"}
                h={"50px"}
                bg={"purple.400"}
                color={"white"}
                onClick={() => handleWithdrawal()}
                boxShadow={"sm"}
                isLoading={isExecuting}
              >
                Withdraw
              </Button>
            </GridItem>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontWeight={"bold"} fontSize={"2xl"} mb={"20px"}>
              Non Fungible Tokens
            </Text>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              {userTokens?.map((element) => (
                <Button
                  display={"flex"}
                  alignItems={"flex-start"}
                  justifyContent={"flex-start"}
                  flexDirection={"column"}
                  height={"300px"}
                  background={"white"}
                  borderRadius={"lg"}
                  borderColor={"gray.200"}
                  boxShadow={"lg"}
                  padding={"10px"}
                  className={"hover:scale-[103%] hover:bg-white duration-75"}
                >
                  <Image
                    src={SampleApe}
                    borderRadius={"lg"}
                    mb={"15px"}
                  ></Image>
                  <Box
                    fontSize={"md"}
                    fontWeight={"bold"}
                    mb={"10px"}
                    ml={"10px"}
                  >
                    {element.tokenId.toString()} #{element.tokenId.toString()}
                  </Box>
                  <Box fontSize={"sm"} color={"gray.400"}>
                    {truncateAddress(element.collectionAddress, 30)}
                  </Box>
                </Button>
              ))}
            </Grid>
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};
