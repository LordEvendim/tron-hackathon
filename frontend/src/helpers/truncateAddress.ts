export const truncateAddress = (address: string, digits: number): string => {
  return `${address.substring(0, digits)}...`;
};
