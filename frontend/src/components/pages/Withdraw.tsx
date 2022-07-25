import {
  Box,
  Heading,
  Grid,
  Button,
  GridItem,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useContracts } from "../../stores/useContracts";
import { BigNumber, ethers } from "ethers";
import { WithdrawItem } from "../WithdrawItem";
import { ONE } from "../../constants/tron";

interface WithdrawProps {}

export interface TokenDetails {
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

      console.log(ONE * parseInt(amount));
      const result = await core.withdraw(ONE * parseInt(amount)).send({
        feeLimit: 100_000_000,
      });

      setIsExecuting(false);
      setAmount("");
      toast.success("Sucuessfully withdrawn TRON");
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
      setIsExecuting(false);
    }
  };

  const removeAuction = (collectionAddress: string, tokenId: string) => {
    const tokens = userTokens;

    if (!tokens) return;

    const updatedTokens = tokens.filter(
      (e) =>
        e.collectionAddress !== collectionAddress &&
        e.tokenId.toString() !== tokenId
    );
    setUserTokens(updatedTokens);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!core) {
          throw new Error("Core contract is not initialized");
        }

        // get user tokens
        const result = await core.getUserTokens().call();

        console.log("User tokens");
        console.log(result);

        if (result[0].length > 0) {
          const formatedAuctions = result[0].map((element: any, i: any) => ({
            index: result[0][i],
            collectionAddress: result[1][i],
            tokenId: result[2][i],
          }));
          setUserTokens(formatedAuctions);
        }

        const balance = await core.getUserBalance().call();

        const balanceFormatted = BigNumber.from(balance)
          .div(BigNumber.from(10).pow(6))
          .toString();

        setUserBalance(balanceFormatted);
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
    <Box w={"full"} paddingX={"80px"} marginBottom={"40px"}>
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
              padding={"20px"}
              boxShadow={"lg"}
              borderRadius={"20px"}
              border={"1px"}
              borderColor={"gray.200"}
              background={"white"}
            >
              <Text fontSize={"sm"}>Available balance:</Text>
              <Text fontSize={"2xl"} fontWeight={"bold"} mb={"60px"}>
                {userBalance} TRX
              </Text>
              <Text ml={2} mb={1}>
                Withdraw amount
              </Text>
              <Input
                backgroundColor={"white"}
                mb={6}
                onChange={(event) => {
                  setAmount(event.target.value);
                }}
              ></Input>
              <Button
                w={"full"}
                h={"50px"}
                bg={"purple.400"}
                color={"white"}
                boxShadow={"sm"}
                isLoading={isExecuting}
                onClick={() => handleWithdrawal()}
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
                <WithdrawItem {...element} handleRemove={removeAuction} />
              ))}
            </Grid>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};
