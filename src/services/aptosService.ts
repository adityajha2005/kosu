import { AptosClient } from "aptos";

const NODE_URL = "https://fullnode.testnet.aptoslabs.com"; //testnet URL
export const aptosClient = new AptosClient(NODE_URL);

const CONTRACT_ADDRESS = "0xfc053e7122749e01dfb70f94d62f78833385ffdaa321e7d6faa50957371ec26"; //deployed contract address
const MODULE_NAME = "mint_stage"; 
const STRUCT_NAME = "MintConfig"; 
const client = new AptosClient(NODE_URL);

// contract resource
export const fetchContractData = async () => {
  try {
    const resource = await aptosClient.getAccountResource(CONTRACT_ADDRESS, `${CONTRACT_ADDRESS}::${MODULE_NAME}::YourResourceStruct`);
    console.log("Fetched contract data:", resource);
    return resource;
  } catch (error) {
    console.error("Error fetching contract data:", error);
    return null;
  }
};
export async function fetchMintStage(accountAddress: string) {
    try {
      const resource = await client.getAccountResource(
        accountAddress,
        `${CONTRACT_ADDRESS}::${MODULE_NAME}::${STRUCT_NAME}`
      );
      console.log("Mint Stage Data:", resource);
      return resource;
    } catch (error) {
      console.error("Error fetching mint stage:", error);
      return null;
    }
  }
