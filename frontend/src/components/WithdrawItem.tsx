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
import { ethers } from "ethers";
import axios from "axios";
import { IPFS_GATEWAY } from "../constants/ipfs";
import ERC721Contract from "../contracts/ERC721.json";
import { ERC721 } from "../contracts/typechain/ERC721";
import { useProvider } from "../stores/useProvider";
import { toast } from "react-toastify";
import { TokenDetails } from "./pages/Withdraw";
import { useUserData } from "../stores/useUserData";
import { useContracts } from "../stores/useContracts";
import { motion } from "framer-motion";

type WithdrawItemProps = {
  handleRemove: (collectionAddress: string, tokenId: string) => void;
} & TokenDetails;

export const WithdrawItem: React.FC<WithdrawItemProps> = memo(
  ({ tokenId, collectionAddress, handleRemove }) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const provider = useProvider((state) => state.provider);
    const [image, setImage] = useState<string>("");
    const userAddress = useUserData((state) => state.address);
    const core = useContracts((state) => state.core);
    const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const FramerContainer = motion(Container);

    const handleWithdraw = async () => {
      setIsWithdrawing(true);
      try {
        if (!core) {
          throw new Error("Core contract is not initialized");
        }

        const result = await core.withdrawToken(collectionAddress, tokenId);
        await result.wait(1);

        handleRemove(collectionAddress, tokenId.toString());
        console.log(result);
      } catch (error: any) {
        if (error instanceof Error) {
          toast.error(error.message);
        }

        console.log(error);
      }
      setIsWithdrawing(false);
    };

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
          const tokenURI = await collectionContract.tokenURI(tokenId);

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

    return (
      <FramerContainer
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
        <Skeleton isLoaded={imageLoaded}>
          <Image
            src={image}
            borderRadius={"lg"}
            mb={"10px"}
            onLoad={() => setImageLoaded(true)}
          ></Image>
        </Skeleton>
        <Box fontSize={"md"} fontWeight={"bold"} mb={"5px"}>
          {tokenId.toString()} #{tokenId.toString()}
        </Box>
        <Box fontSize={"sm"} color={"gray.400"}>
          {collectionAddress}
        </Box>
        <Divider my={"20px"}></Divider>
        <Flex direction={"column"} alignItems={"stretch"} px={"10px"}>
          <HStack mb={"5px"}>
            <Text fontSize={"smaller"} color={"gray.400"}>
              owner:{" "}
            </Text>
            <Text color={"black"}>{truncateAddress(userAddress, 20)}</Text>
          </HStack>
        </Flex>
        <Button
          mt={"15px"}
          w={"full"}
          h={"50px"}
          bg={"purple.400"}
          color={"white"}
          boxShadow={"md"}
          onClick={() => handleWithdraw()}
          isLoading={isWithdrawing}
        >
          Withdraw
        </Button>
      </FramerContainer>
    );
  }
);
