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
import React, { memo, useEffect, useState } from "react";
import { truncateAddress } from "../helpers/truncateAddress";
import Countdown from "react-countdown";
import { Auction } from "../stores/useAuctions";
import { ethers } from "ethers";
import axios from "axios";
import { IPFS_GATEWAY } from "../constants/ipfs";
import ERC721Contract from "../contracts/ERC721.json";
import { ERC721 } from "../contracts/typechain/ERC721";
import { useProvider } from "../stores/useProvider";
import { toast } from "react-toastify";

type AuctionItemProps = {
  handleBid: () => void;
  isFiltered: boolean;
} & Auction;

export const AuctionItem: React.FC<AuctionItemProps> = memo(
  ({
    tokenId,
    collectionAddress,
    bidder,
    endingTime,
    handleBid,
    price,
    isFiltered,
  }) => {
    const endingTimeFormated = parseInt(endingTime.toString()) * 1000;
    const priceFormatted = ethers.utils.formatEther(price);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const provider = useProvider((state) => state.provider);
    const [image, setImage] = useState<string>("");
    const [timerCompleted, setTimerCompleted] = useState<boolean>(false);

    useEffect(() => {
      const fetchMetadata = async () => {
        setIsFetching(true);
        try {
          if (!provider) {
            throw new Error("Provider is not defined");
          }

          // Get token's metadata link
          const collectionContract = new ethers.Contract(
            collectionAddress,
            ERC721Contract.abi,
            provider.getSigner()
          ) as ERC721;
          console.log("<> Fetching tokneURI <>");
          const tokenURI = await collectionContract.tokenURI(tokenId);
          console.log(tokenURI);

          // Fetch metadata
          console.log("<> Fetching metadata <>");
          const ipfsLink = tokenURI.split("//")[1];

          if (!ipfsLink) {
            throw new Error("IPFS link is wrong formated");
          }
          console.log(ipfsLink);
          const result = await axios.get(IPFS_GATEWAY + ipfsLink);

          if (!result) {
            throw new Error("Cannot fetch token's metadata");
          }

          if (!result.data.image) {
            throw new Error("Token has not specified image URL");
          }

          console.log(result.data.image);

          console.log("<> Fetching Image <>");
          const imageIpfsLink = result.data.image.split("//")[1];

          if (!imageIpfsLink) {
            throw new Error("IPFS image link is wrong formated");
          }
          setImage(IPFS_GATEWAY + imageIpfsLink);

          // Fetch image data
        } catch (error: any) {
          console.log(error);
          console.log(error.message);

          if (error instanceof Error) {
            toast.error(error.message);
          }
        }
        setIsFetching(false);
      };

      fetchMetadata();
    }, [provider, collectionAddress, tokenId]);

    if (isFiltered) {
      return null;
    }

    return (
      <Container
        p={"15px"}
        boxShadow={"lg"}
        borderRadius={"20px"}
        border={"1px"}
        borderColor={"gray.200"}
        background={"white"}
      >
        <Image src={image} borderRadius={"lg"} mb={"10px"}></Image>
        <Box fontSize={"md"} fontWeight={"bold"}>
          {tokenId.toString()} #{tokenId.toString()}
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
            {!timerCompleted ? (
              <Countdown
                date={endingTimeFormated}
                onComplete={() => setTimerCompleted(true)}
              />
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
  }
);
