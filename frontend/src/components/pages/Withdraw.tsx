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
import React, { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useContracts } from "../../stores/useContracts";
import { ethers } from "ethers";
import faker from "@faker-js/faker";
import SampleApe from "../../assets/sample-ape.jpg";
import { truncateAddress } from "../../helpers/truncateAddress";

interface WithdrawProps {}

export const WIthdraw: React.FC<WithdrawProps> = () => {
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
                12.321 TRN
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
                onClick={() => handleDeposit()}
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
              {[...new Array(5)].map(() => (
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
                    {23123} #{31232}
                  </Box>
                  <Box fontSize={"sm"} color={"gray.400"}>
                    {truncateAddress(faker.finance.ethereumAddress(), 30)}
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
