import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
  Image,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { truncateAddress } from "../helpers/truncateAddress";
import { useWallet } from "../hooks/useWallet";
import LogoWhite from "../assets/LogoWhite.png";
import Logo from "../assets/Logo.png";

import { useUserData } from "../stores/useUserData";
interface NavigationBarProps {}

export const NavigationBar: React.FC<NavigationBarProps> = () => {
  const userAddress = useUserData((state) => state.address);
  const logout = useUserData((state) => state.logout);
  const location = useLocation();
  const [isHomeScreen, setIsHomescreen] = useState<Boolean>(true);
  const [, connectWallet, disconnectWallet] = useWallet();

  useEffect(() => {
    setIsHomescreen(location.pathname === "/" ? true : false);
  }, [location]);

  return (
    <Box
      w="100%"
      height={"100px"}
      display={"flex"}
      justifyContent={"center"}
      alignItems="center"
    >
      <Flex
        mx={"auto"}
        w="60%"
        py={6}
        justifyContent={"center"}
        alignItems="center"
      >
        <Box>
          <Heading>
            <NavLink to={"/"}>
              <Image
                src={isHomeScreen ? LogoWhite : Logo}
                width={"200px"}
              ></Image>
            </NavLink>
          </Heading>
        </Box>
        <Spacer />
        <HStack spacing="64px">
          <Button
            variant="link"
            textColor={isHomeScreen ? "white" : "gray.800"}
          >
            <NavLink to={"/about"}>About</NavLink>
          </Button>
          <Button
            variant="link"
            textColor={isHomeScreen ? "white" : "gray.800"}
          >
            <NavLink to={"/contracts"}>Contracts</NavLink>
          </Button>
          <Button
            variant="link"
            textColor={isHomeScreen ? "white" : "gray.800"}
          >
            <NavLink to={"/dashboard"}>Auctions</NavLink>
          </Button>

          {useUserData.getState().isLogged ? (
            <Button variant={"outline"}>
              <HStack>
                <NavLink to={"/profile"}>
                  <Text color={isHomeScreen ? "white" : "gray.800"}>
                    {truncateAddress(userAddress, 15)}
                  </Text>
                </NavLink>
                <CloseButton
                  onClick={disconnectWallet}
                  size="sm"
                  color={isHomeScreen ? "white" : "gray.800"}
                />
              </HStack>
            </Button>
          ) : (
            <Button
              w={160}
              h={12}
              isLoading={false}
              onClick={connectWallet}
              color={"gray.700"}
            >
              Connect
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};
