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
import { ethers } from "ethers";

interface DepositProps {}

export const Deposit: React.FC<DepositProps> = () => {
  let navigate = useNavigate();
  const core = useContracts((state) => state.core);

  const [amount, setAmount] = useState<string>();

  const [isExecuting, setIsExecuting] = useState<boolean>();
  const handleDeposit = async () => {
    setIsExecuting(true);
    try {
      if (!core) {
        throw new Error("Contract failed to initialize");
      }

      if (!amount) {
        throw new Error("Provide transaction amount");
      }

      const value = ethers.utils.parseEther(amount);
      console.log(value);

      if (!value) {
        throw new Error("Provide valid value");
      }

      const result = await core.deposit({ value });
      result.wait(1);

      console.log(result);
      setIsExecuting(false);
      setAmount("");
      toast.success("Sucuessfully deposited HBAR");
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
          <Heading mb={"4"}>Deposit liquidity</Heading>
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
                setAmount(event.target.value);
              }}
              value={amount}
            ></Input>
            <Button
              w={"full"}
              h={"50px"}
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
              By depositing liquidity you will gain ability to make bids in all
              auctions.
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};
