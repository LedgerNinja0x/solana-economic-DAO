import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
    TOKEN_PROGRAM_ID,
  } from "@solana/spl-token";
  
import path from 'path';
import { readFileSync } from "fs";
import * as dotenv from 'dotenv';
dotenv.config();


/**
 * HELPER FUNC
 */
function createKeypairFromFile(path: string): Keypair {
  return Keypair.fromSecretKey(
      Buffer.from(JSON.parse(readFileSync(path, "utf-8")))
  )
}
function createPublicKeyFromStr(address: string): PublicKey {
  return new PublicKey(address)
}


/**
 * VARS
 */
const PDA = process.env.PDA as string;
const PAYEE = process.env.PAYEE as string;
const TOKEN_MINT = process.env.TOKEN_MINT as string;
const USER_PATH = process.env.USER_PATH;
const ECOV_PATH = process.env.ECOV_PATH;
const SOLANA_NETWORK = process.env.SOLANA_NETWORK;

const lo = require("buffer-layout");
const TOKEN_TRANSFER_AMOUNT = 1;

let connection: Connection;
let programKeypair: Keypair;
let programId: PublicKey;

let user: Keypair;
let ecov: Keypair;
let pda: PublicKey;
let payee: PublicKey;
let token_mint: PublicKey;


/**
 * SWAP SOL-> ECOV
 * Send x-SOL and recieve x-ECOV
 */
async function swapBabySwap(
      user: Keypair,
      ecov: Keypair,
      pda: PublicKey, 
      payee: PublicKey,
      token_mint: PublicKey,
      connection: Connection
) {
  let data = Buffer.alloc(8)
  lo.ns64("value").encode(TOKEN_TRANSFER_AMOUNT, data);

  let ins = new TransactionInstruction({
    programId: programId,
    data: data,
  keys: [
      {
        isSigner: false,
        isWritable: true,
        pubkey: pda, //pubkey only
      },
      {
        isSigner: true,
        isWritable: true,
        pubkey: user.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: ecov.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: payee, //pubkey only
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: SystemProgram.programId,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: token_mint, //pubkey only
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: TOKEN_PROGRAM_ID, //pubkey only
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: SystemProgram.programId, //pubkey only
      },
    ],
  })

  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(ins),
    [user]
  );
}


/**
 * MAIN
 */
async function main() {
  connection = new Connection(
    `https://api.${SOLANA_NETWORK}.solana.com`, 'confirmed'
  );
  
  programKeypair = createKeypairFromFile(
    path.join(
        path.resolve(__dirname, '../_dist/program'),
        'program-keypair.json'
    )
  );
  programId = programKeypair.publicKey;

  // Accounts
  user = createKeypairFromFile(__dirname + USER_PATH);
  ecov = createKeypairFromFile(__dirname + ECOV_PATH);
  pda = createPublicKeyFromStr(PDA);
  payee = createPublicKeyFromStr(PAYEE);
  token_mint = createPublicKeyFromStr(TOKEN_MINT);

  await swapBabySwap(user, ecov, pda, payee, token_mint, connection);
  console.log("Token transfer succeeded!");
}


main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);