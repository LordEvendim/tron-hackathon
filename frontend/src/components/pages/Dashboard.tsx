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
import { Auction, BidInfo, useAuctions } from "../../stores/useAuctions";
import { toast } from "react-toastify";
import { useContracts } from "../../stores/useContracts";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { ONE } from "../../constants/tron";

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = () => {
  let navigate = useNavigate();
  const core = useContracts((state) => state.core);
  const [isBidModalOpen, setIsBidModalOpen] = useState<boolean>(false);
  const [isBiddingLoading, setIsBiddingLoading] = useState<boolean>(false);
  const [bidValue, setBidValue] = useState<string>("");
  const fetchAuctions = useAuctions((state) => state.fetchAuctions);
  const auctionsFetched = useAuctions((state) => state.auctions);
  const updateAuction = useAuctions((state) => state.updateAuction);

  // Filters
  const [collectionAddressFilter, setCollectionAddressFilter] =
    useState<string>("");
  const [tokeIdFilter, setTokeIdFilter] = useState<string>("");
  const [bidderFilter, setBiderFilter] = useState<string>("");
  const [priceFilterLower, setPriceFilterLower] = useState<string>("");
  const [priceFilterHigher, setPriceFilterHigher] = useState<string>("");
  const miranCore = useContracts((state) => state.core);

  // Bid modal
  const [modalCollection, setModalCollection] = useState<string>("");
  const [modalToken, setModalToken] = useState<BigNumberish>(
    BigNumber.from("0")
  );

  const handleOpenBidModal = useCallback(
    (collectionAddress: string, tokenId: BigNumberish) => {
      setModalCollection(collectionAddress);
      setModalToken(tokenId);
      setIsBidModalOpen(true);
    },
    []
  );

  const handleBid = async () => {
    setIsBiddingLoading(true);
    try {
      if (!miranCore) {
        throw new Error("Core contract is not defined");
      }

      const value = ethers.utils.parseEther(bidValue);

      if (!value) {
        throw new Error("Wrong bid value");
      }

      console.log("BID");
      console.log(ONE * parseInt(bidValue));

      const result = await miranCore
        .bid(modalCollection, modalToken.toString(), ONE * parseInt(bidValue))
        .send({
          feeLimit: 100_000_000,
          callValue: ONE * parseInt(bidValue),
        });
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
    setIsBiddingLoading(false);
  };

  const isVisible = (auction: Auction): boolean => {
    if (
      collectionAddressFilter &&
      auction.collectionAddress.substring(0, collectionAddressFilter.length) !==
        collectionAddressFilter
    )
      return false;

    if (
      tokeIdFilter &&
      auction.tokenId.toString().substring(0, tokeIdFilter.length) !==
        tokeIdFilter
    )
      return false;

    if (
      bidderFilter &&
      auction.bidder.substring(0, bidderFilter.length) !== bidderFilter
    )
      return false;

    try {
      const filteredPriceLower =
        ethers.utils.parseEther(priceFilterLower) ?? "";
      if (filteredPriceLower) {
        if (filteredPriceLower.gt(auction.price)) {
          return false;
        }
      }
    } catch (error: any) {}

    try {
      const filteredPriceHigher = ethers.utils.parseEther(priceFilterHigher);
      if (filteredPriceHigher) {
        if (filteredPriceHigher.lt(auction.price)) {
          return false;
        }
      }
    } catch (error: any) {}

    return true;
  };

  // fetch auctions
  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  useEffect(() => {
    console.log(auctionsFetched);
  }, [auctionsFetched]);

  useEffect(() => {
    try {
      if (!core) {
        throw new Error("Core contract is undefined");
      }

      core.Bid().watch((error: any, event: any) => {
        if (error) {
          throw new Error(error);
        }

        updateAuction({
          bidder: event.bidder,
          collectionAddress: event.collectionAddress,
          endingTime: event.endingTime,
          price: event.price,
          tokenId: event.tokenId,
        });
      });
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
    }
  }, [core, updateAuction]);

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
              padding={"20px"}
            >
              <Text ml={2} mb={1} fontSize={"sm"}>
                Collection
              </Text>
              <Input
                backgroundColor={"white"}
                mb={8}
                onChange={(event) => {
                  setCollectionAddressFilter(event.target.value);
                }}
              ></Input>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Name / ID
              </Text>
              <Input
                backgroundColor={"white"}
                mb={8}
                onChange={(event) => {
                  setTokeIdFilter(event.target.value);
                }}
              ></Input>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Bidder
              </Text>
              <Input
                backgroundColor={"white"}
                mb={8}
                onChange={(event) => {
                  setBiderFilter(event.target.value);
                }}
              ></Input>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Price
              </Text>
              <HStack mb={2}>
                <Input
                  backgroundColor={"white"}
                  onChange={(event) => {
                    setPriceFilterLower(event.target.value);
                  }}
                ></Input>
                <Input
                  backgroundColor={"white"}
                  onChange={(event) => {
                    setPriceFilterHigher(event.target.value);
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
                    handleBid={() =>
                      handleOpenBidModal(
                        element.collectionAddress,
                        element.tokenId
                      )
                    }
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
