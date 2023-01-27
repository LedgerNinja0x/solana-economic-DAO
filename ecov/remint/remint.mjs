import {
  createMint,
  mintTo,
  getMint,
  getAccount,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Keypair,
} from '@solana/web3.js';
import { config } from 'dotenv';
config();
import pkg from 'bs58';
const { base58 } = pkg;


/**
 * VARS
 */
const PAYER = process.env.PAYER;
const TOKEN_MINT = process.env.TOKEN_MINT;
const MINT_AMOUNT = process.env.MINT_AMOUNT;
const MINT_AUTHORITY = process.env.MINT_AUTHORITY;
const FREEZE_AUTHORITY = process.env.FREEZE_AUTHORITY;
const SOLANA_NETWORK = process.env.SOLANA_NETWORK;
const connection = new Connection(
  clusterApiUrl(SOLANA_NETWORK),
  'confirmed'
);
let payer = Keypair.fromSecretKey(pkg.decode(PAYER));
let mintAuthority = Keypair.fromSecretKey(pkg.decode(MINT_AUTHORITY));
let freezeAuthority = Keypair.fromSecretKey(pkg.decode(FREEZE_AUTHORITY));
let tokenMint = createPublicKeyFromStr(TOKEN_MINT);


/**
 * HELPER FUNC
 */
function createPublicKeyFromStr(address) {
  return new PublicKey(address)
}


// /**
//  * MINT TOKEN
//  * if you have already minted the initial token, then
//  * don't create a new tokenMintAccount, but rather
//  * import the preexisting tokenMint and mint more
//  */
// const mint = await createMint(
//   connection,
//   payer,
//   mintAuthority.publicKey,
//   freezeAuthority.publicKey,
//   9 // 9 decimal is the CLI default
// );
// console.log(mint.toBase58());

// const mintInfo = await getMint(
//     connection,
//     mint
//   )
// console.log("Token Mint = {}", mintInfo.supply);


/**
 * GET TOKEN MINT ACCOUNT
 * import preexisting tokenMintAccount
 */
const mint = tokenMint;
  

/**
 * CREATE TOKEN ATA
 */
const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  )
console.log("ATA =", tokenAccount.address.toBase58());
  
const tokenAccountInfo = await getAccount(
    connection,
    tokenAccount.address
  )
console.log("Token amount =", tokenAccountInfo.amount);


/**
 * CREATE SUPPLY
 */
await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    mintAuthority,
    MINT_AMOUNT * 1000000000
)
console.log(`Minted ${MINT_AMOUNT} tokens to ${tokenAccount.address}`);  


/**
 * QUERY SUPPLY
 */
const QueryMint = await getMint(
    connection,
    mint
  )
console.log("Token supply (total) =", QueryMint.supply);
  
const ATAinfo = await getAccount(
    connection,
    tokenAccount.address
  )
console.log("Token supply (payer's ATA) =", ATAinfo.amount);