import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";
import SampleApe from "../assets/sample-ape.jpg";
import { truncateAddress } from "../helpers/truncateAddress";
import Countdown from "react-countdown";
import { Auction } from "../stores/useAuctions";
import { ethers } from "ethers";

type AuctionItemProps = {
  handleBid: () => void;
  time: number;
} & Auction;

export const AuctionItem: React.FC<AuctionItemProps> = ({
  tokenId,
  collectionAddress,
  bidder,
  endingTime,
  handleBid,
  price,
  time,
}) => {
  const endingTimeFormated = parseInt(endingTime.toString());
  const priceFormatted = ethers.utils.formatEther(price);

  return (
    <Container
      p={"15px"}
      boxShadow={"lg"}
      borderRadius={"20px"}
      border={"1px"}
      borderColor={"gray.200"}
      background={"white"}
    >
      <Image src={SampleApe} borderRadius={"lg"} mb={"10px"}></Image>
      <Box fontSize={"md"} fontWeight={"bold"}>
        {tokenId} #{tokenId}
      </Box>
      <Box fontSize={"sm"} color={"gray.400"}>
        {collectionAddress}
      </Box>
      <Divider my={"10px"}></Divider>
      <Flex direction={"column"} alignItems={"stretch"} px={"10px"}>
        <HStack mb={"5px"}>
          <Text fontSize={"smaller"} color={"gray.400"}>
            bidder:{" "}
          </Text>
          <Text color={"black"}>{truncateAddress(bidder, 20)}</Text>
        </HStack>
        <Box mb={"5px"} color={"gray.400"} fontSize={"smaller"}>
          ends in:
        </Box>
        <Flex justifyContent={"center"} fontSize={"3xl"} mb={"30px"}>
          {endingTimeFormated - time > 0 ? (
            <Countdown date={endingTimeFormated} />
          ) : (
            <Box
              fontSize={"2xl"}
              fontWeight={"semibold"}
              mb={"10px"}
              mt={"10px"}
            >
              Auction has ended
            </Box>
          )}
        </Flex>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Button w={"120px"} onClick={() => handleBid()}>
            Bid
          </Button>
          <Box fontWeight={"bold"}>{priceFormatted} TRN</Box>
        </Flex>
      </Flex>
    </Container>
  );
};
