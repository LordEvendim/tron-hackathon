import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

import { useUserData } from "../stores/useUserData";
interface NavigationBarProps {}

export const NavigationBar: React.FC<NavigationBarProps> = () => {
  const userAddress = useUserData((state) => state.address);
  const logout = useUserData((state) => state.logout);

  const handleConnect = async () => {};

  const disconnectWallet = async () => {
    logout();
  };

  return (
    <Box w="100%" height={"120px"}>
      <Flex
        mx={"auto"}
        w="60%"
        py={6}
        justifyContent={"center"}
        alignItems="center"
      >
        <Box>
          <Heading color={"white"}>
            <NavLink to={"/"}>FairHouse</NavLink>
          </Heading>
        </Box>
        <Spacer />
        <HStack spacing="64px">
          <Button variant="link" textColor="white">
            <NavLink to={"/about"}>About</NavLink>
          </Button>
          <Button variant="link" textColor="white">
            <NavLink to={"/contracts"}>Contracts</NavLink>
          </Button>
          <Button variant="link" textColor="white">
            <NavLink to={"/dashboard"}>
              <Text color={"white"}>Auctions</Text>
            </NavLink>
          </Button>

          {useUserData.getState().isLogged ? (
            <Button variant={"outline"}>
              <HStack>
                <NavLink to={"/profile"}>
                  <Text>{userAddress}</Text>
                </NavLink>
                <CloseButton onClick={disconnectWallet} size="sm" />
              </HStack>
            </Button>
          ) : (
            <Button
              w={150}
              h={12}
              isLoading={false}
              onClick={() => handleConnect()}
            >
              Connect
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};
