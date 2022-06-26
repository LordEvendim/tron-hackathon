import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Input,
  Spacer,
  VStack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuctionItem } from "../AuctionItem";
import faker from "@faker-js/faker";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { mintModalStyle } from "../../modals/mintModalStyle";
import Modal from "react-modal";

interface DashboardProps {}

const auctions = new Array(10).fill(0).map(() => ({
  name: "Bored Ape",
  id: "123432",
  collection: "Bored Apes",
  bidData: {
    bidder: faker.finance.ethereumAddress(),
    price: (Math.round(Math.random() * 10000) / 100).toString(),
    endingDate: Date.now() + 30 * 60 * (Math.round(Math.random() * 10) + 1),
  },
}));

export const Dashboard: React.FC<DashboardProps> = () => {
  let navigate = useNavigate();
  const [isBidModalOpen, setIsBidModalOpen] = useState<boolean>(false);
  const [isBiddingLoading, setIsBiddingLoading] = useState<boolean>(false);
  const [bidValue, setBidValue] = useState<string>("");
  const [time, setTime] = useState<number>(Date.now());

  const handleOpenBidModal = () => {
    setIsBidModalOpen(true);
  };

  const handleBid = async () => {
    setIsBiddingLoading(true);
    console.log(bidValue);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Container w={"full"} centerContent>
      <Modal
        isOpen={isBidModalOpen}
        onRequestClose={() => setIsBidModalOpen(false)}
        style={mintModalStyle}
        contentLabel="Example Modal"
      >
        <Heading
          fontWeight={"semibold"}
          fontSize={"3xl"}
          textColor={"gray.600"}
          mb={"20px"}
        >
          Bid
        </Heading>
        <VStack spacing={"10px"} align={"start"}>
          <Text>Bid value</Text>
          <Flex w={"full"}>
            <Input
              flex={"1"}
              mr={"10px"}
              onChange={(event) => setBidValue(event.target.value)}
            ></Input>
            <Button
              width={"150px"}
              p={"15px"}
              onClick={() => handleBid()}
              isLoading={isBiddingLoading}
            >
              Place a bid!
            </Button>
          </Flex>
        </VStack>

        <Text mt={"20px"} px={"10px"} color={"gray.500"}>
          <AiOutlineInfoCircle />
          <Text mt={"5px"}>
            Place amount higher than current bid. After successful transaction
            you will become the highest bidder.
          </Text>
        </Text>
      </Modal>
      <Box h={"10"} />
      <Box w={"container.xl"}>
        <Flex>
          <Heading mb={"4"}>Auctions</Heading>
          <Spacer />
          <HStack spacing={"10px"}>
            <Button
              onClick={() => {
                navigate("/create");
              }}
            >
              + create auction
            </Button>
            <Button
              onClick={() => {
                navigate("/deposit-nft");
              }}
            >
              deposit NFT
            </Button>
            <Button
              onClick={() => {
                navigate("/deposit");
              }}
            >
              deposit liquidity
            </Button>
          </HStack>
        </Flex>
        <Box h={"2"} />
        <Grid templateColumns="repeat(3, 1fr)" gap={3}>
          {auctions.map((element) => (
            <AuctionItem
              {...element}
              time={time}
              handleBid={handleOpenBidModal}
            />
          ))}
        </Grid>
      </Box>
    </Container>
  );
};
