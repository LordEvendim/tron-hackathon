import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  HStack,
  Image,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { truncateAddress } from "../helpers/truncateAddress";
import Countdown from "react-countdown";
import { Auction, useAuctions } from "../stores/useAuctions";
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { IPFS_GATEWAY } from "../constants/ipfs";
import ERC721Contract from "../contracts/ERC721.json";
import { ERC721 } from "../contracts/typechain/ERC721";
import { useProvider } from "../stores/useProvider";
import { toast } from "react-toastify";
import { useContracts } from "../stores/useContracts";
import { motion } from "framer-motion";

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
    const priceFormatted = BigNumber.from(price)
      .div(BigNumber.from(10).pow(6))
      .toString();

    const endingTimeFormated = parseInt(endingTime.toString()) * 1000;
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const provider = useProvider((state) => state.provider);
    const [image, setImage] = useState<string>("");
    const [timerCompleted, setTimerCompleted] = useState<boolean>(false);
    const [isClaiming, setIsClaiming] = useState<boolean>(false);
    const core = useContracts((state) => state.core);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const removeAuction = useAuctions((state) => state.removeAuction);

    // Framer motion
    const FramerContrainer = motion(Container);

    useEffect(() => {
      if (endingTimeFormated < Date.now()) {
        setTimerCompleted(true);
      }
    }, [endingTimeFormated]);

    const claimAuction = async () => {
      setIsClaiming(true);
      try {
        if (!core) {
          throw new Error("Core contract is not initialized");
        }

        const result = await core
          .claimAuction(collectionAddress, tokenId)
          .send({
            feeLimit: 100_000_000,
          });
        removeAuction(collectionAddress, tokenId.toString());
        console.log(result);
      } catch (error: any) {
        if (error instanceof Error) {
          toast.error(error.message);
        }

        console.log(error);
      }
      setIsClaiming(false);
    };

    useEffect(() => {
      const fetchMetadata = async () => {
        setIsFetching(true);
        try {
          if (!provider) {
            throw new Error("Provider is not defined");
          }

          // Get token's metadata link
          console.log("collectionAddress: " + collectionAddress);
          const collectionContract = await window.tronWeb
            .contract()
            .at(collectionAddress);
          const tokenURI = await collectionContract.tokenURI(tokenId).call();

          // Fetch metadata
          const ipfsLink = tokenURI.split("//")[1];

          if (!ipfsLink) {
            throw new Error("IPFS link is wrong formated");
          }
          const result = await axios.get(IPFS_GATEWAY + ipfsLink);

          if (!result) {
            throw new Error("Cannot fetch token's metadata");
          }

          if (!result.data.image) {
            throw new Error("Token has not specified image URL");
          }

          const imageIpfsLink = result.data.image.split("//")[1];

          if (!imageIpfsLink) {
            throw new Error("IPFS image link is wrong formated");
          }
          setImage(IPFS_GATEWAY + imageIpfsLink);

          // Fetch image data
        } catch (error: any) {
          console.log(error);

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
      <FramerContrainer
        p={"15px"}
        boxShadow={"lg"}
        borderRadius={"20px"}
        border={"1px"}
        borderColor={"gray.200"}
        background={"white"}
        whileHover={{ scale: 0.99 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ scale: 0 }}
        transition={{
          type: "ease",
          duration: 0.1,
        }}
      >
        <Flex justifyContent={"center"}>
          <Skeleton isLoaded={imageLoaded}>
            <Image
              src={image}
              borderRadius={"lg"}
              mb={"10px"}
              maxHeight={"300px"}
              onLoad={() => setImageLoaded(true)}
            ></Image>
          </Skeleton>
        </Flex>
        <Box fontSize={"md"} fontWeight={"bold"}>
          #{tokenId.toString()}
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
            {timerCompleted ? (
              <Box
                fontSize={"2xl"}
                fontWeight={"semibold"}
                mb={"10px"}
                mt={"10px"}
              >
                Auction has ended
              </Box>
            ) : (
              <Countdown
                date={endingTimeFormated}
                onComplete={() => setTimerCompleted(true)}
              />
            )}
          </Flex>
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            {timerCompleted ? (
              <Button
                w={"120px"}
                onClick={() => claimAuction()}
                isLoading={isClaiming}
              >
                Claim
              </Button>
            ) : (
              <Button w={"120px"} onClick={() => handleBid()}>
                Bid
              </Button>
            )}
            <Box fontWeight={"bold"}>{priceFormatted} TRX</Box>
          </Flex>
        </Flex>
      </FramerContrainer>
    );
  }
);
