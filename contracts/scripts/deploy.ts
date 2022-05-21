import MiranCore from "../artifacts/contracts/MiranCore.sol/MiranCore.json";
import {
  AccountId,
  Client,
  ContractCreateTransaction,
  FileCreateTransaction,
  Hbar,
  PrivateKey,
} from "@hashgraph/sdk";
require("dotenv").config();

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID ?? "");
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY ?? "");

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  console.log(new TextEncoder().encode(MiranCore.bytecode).length);

  const contractFile = MiranCore.bytecode;
  const fileCreateTx = new FileCreateTransaction()
    .setContents(contractFile)
    .setKeys([operatorKey])
    .setMaxTransactionFee(new Hbar(10))
    .freezeWith(client);
  const fileCreateSign = await fileCreateTx.sign(operatorKey);
  const fileCreateSubmit = await fileCreateSign.execute(client);
  const fileCreateRx = await fileCreateSubmit.getReceipt(client);
  const bytecodeFileId = fileCreateRx.fileId;
  console.log(`- The bytecode file ID is: ${bytecodeFileId} \n`);

  if (!bytecodeFileId) throw new Error("bytecodeFileId is null");

  // Instantiate the smart contract
  const contractInstantiateTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(100000);
  const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
  const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(
    client
  );
  const contractId = contractInstantiateRx.contractId;

  if (!contractId) throw new Error("contractId is null");

  const contractAddress = contractId.toSolidityAddress();
  console.log(`- The smart contract ID is: ${contractId} \n`);
  console.log(`- Smart contract ID in Solidity format: ${contractAddress} \n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
