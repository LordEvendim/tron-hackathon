import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  HStack,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

import { truncateAddress } from "../helpers/truncateAddress";
import { useUserData } from "../stores/useUserData";
import Logo from "../assets/miranlogo.png";

import { useHashconnect } from "../stores/useHashconnect";
import { initalizeHashconnect } from "../modules/hashconnect/initializeHashconnect";

interface NavigationBarProps {}

export const NavigationBar: React.FC<NavigationBarProps> = () => {
  const userAddress = useUserData((state) => state.address);
  const hashconnect = useHashconnect((state) => state.hashconenct);
  const hashpackData = useHashconnect((state) => state.data);
  const setData = useHashconnect((state) => state.setData);
  const logout = useUserData((state) => state.logout);

  const handleConnect = async () => {
    if (!hashconnect) throw new Error("Hashconnect has not been initialized");

    // Hashconnect initalization goes here
    const [firstTimeLogin, pairingKey] = await initalizeHashconnect();

    if (!firstTimeLogin) return;

    hashconnect.findLocalWallets();
    console.log(pairingKey);

    hashconnect.connectToLocalWallet(pairingKey);
  };

  const disconnectWallet = async () => {
    setData({
      pairedAccounts: [],
      pairingString: "",
      topic: "",
      pairedWalletData: undefined,
      privateKey: "",
    });
    logout();
    localStorage.removeItem("hashconnectData");
  };

  return (
    <Box w="100%">
      <Flex mx={"auto"} w="60%" py={6} alignItems="">
        <Box>
          <Heading>
            <NavLink to={"/"}>
              <Image src={Logo} h={"80px"} />
            </NavLink>
          </Heading>
        </Box>
        <Spacer />
        <HStack spacing="64px">
          <Button variant="link" textColor="gray.600">
            <NavLink to={"/about"}>About</NavLink>
          </Button>
          <Button variant="link" textColor="gray.600">
            <NavLink to={"/contracts"}>Contracts</NavLink>
          </Button>
          <Button variant="link" textColor="gray.600">
            <NavLink to={"/dashboard"}>
              <Text color={"cyan.600"}>Auctions</Text>
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
