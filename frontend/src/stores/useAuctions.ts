import { BigNumberish } from "ethers";
import { toast } from "react-toastify";
import create from "zustand";
import { useContracts } from "./useContracts";
export type AuctionDetails = {
  address: string;
  name: string;
  symbol: string;
  description: string;
  liquidity: BigNumberish;
  interest: number;
};

export type Auction = {
  creator: string;
  collectionAddress: string;
  tokenId: BigNumberish;
  endingTime: BigNumberish;
  price: BigNumberish;
  bidder: string;
};

export type BidInfo = {
  collectionAddress: string;
  tokenId: BigNumberish;
  bidder: string;
  price: BigNumberish;
  endingTime: BigNumberish;
};

interface useAuctionsStore {
  auctions: Auction[] | undefined;
  fetchAuctions: () => void;
  updateAuction: (bidInfo: BidInfo) => void;
}

export const useAuctions = create<useAuctionsStore>((set, get) => ({
  auctions: [],
  fetchAuctions: async () => {
    try {
      const factory = useContracts.getState().core;

      if (!factory) {
        throw new Error("Contract initialization failed");
      }

      const auctions = await factory.getAllAuctions();

      if (!auctions) {
        throw new Error("Failed to fetch auctions");
      }

      const formatedAuctions = auctions.map((element) => ({
        creator: element.creator,
        collectionAddress: element.collectionAddress,
        tokenId: element.tokenId,
        endingTime: element.endingTime,
        price: element.price,
        bidder: element.bidder,
      }));

      set({ auctions: formatedAuctions });
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
  updateAuction: (bidInfo: BidInfo) => {
    const { collectionAddress, tokenId, endingTime, price } = bidInfo;
    const auctions = get().auctions;

    if (!auctions) return;

    const updatedAuctions: Auction[] = auctions.map((element) =>
      element.collectionAddress === collectionAddress &&
      element.tokenId === tokenId
        ? {
            creator: element.creator,
            collectionAddress: collectionAddress,
            tokenId: tokenId,
            endingTime: endingTime,
            price: price,
            bidder: element.bidder,
          }
        : element
    );

    set({ auctions: updatedAuctions });
  },
}));
