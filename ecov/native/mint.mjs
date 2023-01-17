const web3 = require('@solana/web3.js');
import { createMint } from '@solana/spl-token';
import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
config();


/**
 * VARS
 */
const SOLANA_NETWORK = process.env.SOLANA_NETWORK;
const PAYER= process.env.PAYER;
const FREEZE_AUTHORITY = process.env.FREEZE_AUTHORITY;
const MINT_AUTHORITY = process.env.MINT_AUTHORITY;
const connection = new Connection(
  clusterApiUrl(SOLANA_NETWORK),
  'confirmed'
);
let payer = keypairFromStr(PAYER)
let mintAuthority = keypairFromStr(MINT_AUTHORITY);
let freezeAuthority = keypairFromStr(FREEZE_AUTHORITY);


/**
 *  HELPER FUNC
 */
function keypairFromStr(secretKey) {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(readFileSync(secretKey, "utf-8")))
    )
}


/**
 * MINT TOKEN
 */
const mint = await createMint(
  connection,
  payer,
  mintAuthority.publicKey,
  freezeAuthority.publicKey,
  9 // 9 decimal is the CLI default
);
console.log(mint.toBase58());

const mintInfo = await getMint(
    connection,
    mint
  )
console.log(mintInfo.supply);
  

/**
 * CREATE TOKEN ATA
 */
const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  )
console.log(tokenAccount.address.toBase58());
  
const tokenAccountInfo = await getAccount(
    connection,
    tokenAccount.address
  )
console.log(tokenAccountInfo.amount);


/**
 * CREATE SUPPLY
 */
await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    mintAuthority,
    10000 * 1000000000
)
  


/**
 * QUERY SUPPLY
 */
const QueryMint = await getMint(
    connection,
    mint
  )
console.log(QueryMint.supply);
  
const ATAinfo = await getAccount(
    connection,
    tokenAccount.address
  )
console.log(ATAinfo.amount);