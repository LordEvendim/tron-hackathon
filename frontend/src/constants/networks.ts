interface NetworkDetails {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export enum AvailableNetworks {
  FUJI = "fuji",
  MUMBAI = "mumbai",
  THETA = "theta",
  THETA_TESTNET = "thetaTestnet",
  LOCAL = "local",
}

export const CURRENT_NETWORK = AvailableNetworks.LOCAL;

export const networks: { [network in AvailableNetworks]: NetworkDetails } = {
  fuji: {
    chainId: `0x${Number(43113).toString(16)}`,
    chainName: "Avalanche Fuji Testnet",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/"],
  },
  mumbai: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.matic.today"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
  thetaTestnet: {
    chainId: `0x${Number(365).toString(16)}`,
    chainName: "Theta Testnet",
    nativeCurrency: {
      name: "TFUEL",
      symbol: "TFUEL",
      decimals: 18,
    },
    rpcUrls: ["https://eth-rpc-api-testnet.thetatoken.org/rpc"],
    blockExplorerUrls: ["https://testnet-explorer.thetatoken.org"],
  },
  theta: {
    chainId: `0x${Number(361).toString(16)}`,
    chainName: "Theta",
    nativeCurrency: {
      name: "TFUEL",
      symbol: "TFUEL",
      decimals: 18,
    },
    rpcUrls: ["https://eth-rpc-api.thetatoken.org/rpc"],
    blockExplorerUrls: ["https://explorer.thetatoken.org"],
  },
  local: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: "Localhost 8545",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://localhost:8545"],
    blockExplorerUrls: ["https://explorer.thetatoken.org"],
  },
};
