import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Input,
  VStack,
  Text,
  GridItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuctionItem } from "../AuctionItem";
import faker from "@faker-js/faker";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { bidModalStyle } from "../../modals/bidModalStyle";
import Modal from "react-modal";
import { useAuctions } from "../../stores/useAuctions";

interface DashboardProps {}

const auctions = new Array(10).fill(0).map(() => ({
  name: "Bored Ape",
  id: "123432",
  collection: "Bored Apes",
  bidData: {
    bidder: faker.finance.ethereumAddress(),
    price: (Math.round(Math.random() * 10000) / 100).toString(),
    endingDate: Date.now() + 300 * 60 * (Math.round(Math.random() * 10) + 1),
  },
}));

export const Dashboard: React.FC<DashboardProps> = () => {
  let navigate = useNavigate();
  const [isBidModalOpen, setIsBidModalOpen] = useState<boolean>(false);
  const [isBiddingLoading, setIsBiddingLoading] = useState<boolean>(false);
  const [bidValue, setBidValue] = useState<string>("");
  const [time, setTime] = useState<number>(Date.now());
  const fetchAuctions = useAuctions((state) => state.fetchAuctions);
  const auctionsFetched = useAuctions((state) => state.auctions);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [interest, setInterest] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");

  const handleOpenBidModal = () => {
    setIsBidModalOpen(true);
  };

  const handleBid = async () => {
    setIsBiddingLoading(true);
    console.log(bidValue);
  };

  // update every second to force update of child components
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // fetch auctions
  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  useEffect(() => {
    console.log(auctionsFetched);
  }, [auctionsFetched]);

  return (
    <Box w={"full"} paddingX={"80px"} marginBottom={"40px"}>
      <Modal
        isOpen={isBidModalOpen}
        onRequestClose={() => setIsBidModalOpen(false)}
        style={bidModalStyle}
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
      <Box width={"full"}>
        <Flex align={"center"}>
          <Heading
            mb={"4"}
            marginLeft={"20px"}
            marginRight={"30px"}
            color={"gray.800"}
          >
            Auctions
          </Heading>
          <HStack marginBottom={"8px"} spacing={"20px"}>
            <Button
              bg={"purple.400"}
              color={"white"}
              boxShadow={"md"}
              onClick={() => {
                navigate("/create");
              }}
            >
              + create auction
            </Button>
            <Button
              bg={"purple.400"}
              color={"white"}
              boxShadow={"md"}
              onClick={() => {
                navigate("/withdraw");
              }}
            >
              withdraw
            </Button>
          </HStack>
        </Flex>
        <Box h={"2"} />
        <Grid templateColumns="repeat(4, 1fr)" gap={3}>
          <GridItem colSpan={1}>
            <Box
              boxShadow={"lg"}
              borderRadius={"20px"}
              border={"1px"}
              borderColor={"gray.200"}
              background={"white"}
              height={"600px"}
              padding={"20px"}
            >
              <Text ml={2} mb={1} fontSize={"sm"}>
                Collection
              </Text>
              <Input
                backgroundColor={"white"}
                mb={4}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              ></Input>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Name / ID
              </Text>
              <Input
                backgroundColor={"white"}
                mb={4}
                onChange={(event) => {
                  setSymbol(event.target.value);
                }}
              ></Input>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Bidder
              </Text>
              <Input
                backgroundColor={"white"}
                mb={4}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              ></Input>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Price
              </Text>
              <HStack mb={4}>
                <Input
                  backgroundColor={"white"}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                ></Input>
                <Input
                  backgroundColor={"white"}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                ></Input>
              </HStack>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Time to end
              </Text>
              <HStack mb={4}>
                <Input
                  backgroundColor={"white"}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                ></Input>
                <Input
                  backgroundColor={"white"}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                ></Input>
              </HStack>
            </Box>
          </GridItem>
          <GridItem colSpan={3}>
            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              {auctionsFetched?.map((element) => (
                <AuctionItem
                  {...element}
                  time={time}
                  handleBid={handleOpenBidModal}
                />
              ))}
            </Grid>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};
