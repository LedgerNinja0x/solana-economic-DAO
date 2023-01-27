import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { config } from "dotenv";
config();

// Instantiate the SDK and pass in a signer
const sdk = ThirdwebSDK.fromPrivateKey("devnet", process.env.LIQUIDITY_POOL_PRIVATE_KEY);

// Define your program metadata
const metadata = {
    symbol: "ECOV",
    description: "Ecoverse native token, living on the Solana blockchain",
    name: "EcoVerse",
    initialSupply: 1000000,
};

// Deploy a program from the connected wallet
const address = await sdk.deployer.createToken(metadata);
console.log("Address = ", address);
console.log("Successfull deploy 🎉");

// After deployment, show the total token supply
const token = await sdk.getToken(address);
const supply = await token.totalSupply();
    
console.log("Supply = ", supply);