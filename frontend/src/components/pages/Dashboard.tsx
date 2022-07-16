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
  Center,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuctionItem } from "../AuctionItem";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { bidModalStyle } from "../../modals/bidModalStyle";
import Modal from "react-modal";
import { Auction, useAuctions } from "../../stores/useAuctions";

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = () => {
  let navigate = useNavigate();
  const [isBidModalOpen, setIsBidModalOpen] = useState<boolean>(false);
  const [isBiddingLoading, setIsBiddingLoading] = useState<boolean>(false);
  const [bidValue, setBidValue] = useState<string>("");
  const [time, setTime] = useState<number>(Date.now());
  const fetchAuctions = useAuctions((state) => state.fetchAuctions);
  const auctionsFetched = useAuctions((state) => state.auctions);

  // Filters
  const [collectionAddressFilter, setCollectionAddressFilter] =
    useState<string>("");
  const [tokeIdFilter, setTokeIdFilter] = useState<string>("");
  const [bidderFilter, setBiderFilter] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");

  const handleOpenBidModal = useCallback(() => {
    setIsBidModalOpen(true);
  }, []);

  const handleBid = async () => {
    setIsBiddingLoading(true);
    console.log(bidValue);
  };

  const isVisible = (auction: Auction): boolean => {
    return collectionAddressFilter
      ? auction.collectionAddress.substring(
          0,
          collectionAddressFilter.length
        ) === collectionAddressFilter
      : true;
  };

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
                  setCollectionAddressFilter(event.target.value);
                }}
              ></Input>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Name / ID
              </Text>
              <Input
                backgroundColor={"white"}
                mb={4}
                onChange={(event) => {
                  setTokeIdFilter(event.target.value);
                }}
              ></Input>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Bidder
              </Text>
              <Input
                backgroundColor={"white"}
                mb={4}
                onChange={(event) => {
                  setBiderFilter(event.target.value);
                }}
              ></Input>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Price
              </Text>
              <HStack mb={4}>
                <Input
                  backgroundColor={"white"}
                  onChange={(event) => {
                    setBiderFilter(event.target.value);
                  }}
                ></Input>
                <Input
                  backgroundColor={"white"}
                  onChange={(event) => {
                    setBiderFilter(event.target.value);
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
                    setBiderFilter(event.target.value);
                  }}
                ></Input>
                <Input
                  backgroundColor={"white"}
                  onChange={(event) => {
                    setBiderFilter(event.target.value);
                  }}
                ></Input>
              </HStack>
            </Box>
          </GridItem>
          <GridItem colSpan={3}>
            {auctionsFetched?.length === 0 ? (
              <Center
                fontSize={"3xl"}
                color={"gray.300"}
                mt={"50px"}
                fontWeight={"extrabold"}
              >
                No available auctions {":("}
              </Center>
            ) : (
              <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                {auctionsFetched?.map((element) => (
                  <AuctionItem
                    {...element}
                    isFiltered={!isVisible(element)}
                    handleBid={handleOpenBidModal}
                    key={element.collectionAddress + element.tokenId}
                  />
                ))}
              </Grid>
            )}
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};
