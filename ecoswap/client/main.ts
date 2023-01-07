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
import * as bs58 from 'bs58';
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
const PAYEE = process.env.PAYEE as string;
const VAULT = process.env.VAULT as string;
const VAULT_ATA = process.env.VAULT_ATA as string;
const TOKEN_MINT = process.env.TOKEN_MINT as string;
const USER_PRIVATEKEY = process.env.USER_PRIVATEKEY as string;
const SOLANA_NETWORK = process.env.SOLANA_NETWORK;
// const PDA = process.env.PDA as string;
// const USER_ATA = process.env.USER_ATA as string;
const lo = require("buffer-layout");
const TOKEN_TRANSFER_AMOUNT = 1;

let user: Keypair;
let vault: Keypair;
// let user_ata: PublicKey;
let vault_ata: PublicKey;
// let pda: PublicKey;
let payee: PublicKey;
let token_mint: PublicKey;
let connection: Connection;
let programKeypair: Keypair;
let programId: PublicKey;


/**
 * SWAP SOL-> ECOV
 * Send x-SOL and recieve x-ECOV
 */
async function swapBabySwap(
      connection: Connection,
      user: Keypair,
      payee: PublicKey,
      token_mint: PublicKey,
      vault_ata: PublicKey,
      vault: Keypair,
      // user_ata: PublicKey,
      // pda: PublicKey, 
) {
  let data = Buffer.alloc(8)
  lo.ns64("value").encode(TOKEN_TRANSFER_AMOUNT, data);

  let ins = new TransactionInstruction({
    programId: programId,
    data: data,
  keys: [
      {
        isSigner: true,
        isWritable: true,
        pubkey: user.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: payee, //pubkey
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: SystemProgram.programId, //pubkey
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: token_mint, //pubkey (ATA)
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: TOKEN_PROGRAM_ID, //pubkey
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: vault_ata, //pubkey (ATA)
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: vault.publicKey,
      },
      // {
      //   isSigner: false,
      //   isWritable: true,
      //   pubkey: user_ata, //pubkey only
      // },
      // {
      //   isSigner: false,
      //   isWritable: true,
      //   pubkey: pda, //pubkey (PDA)
      // },
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
  // user = createKeypairFromFile(__dirname + USER_PATH);
  // pda = createPublicKeyFromStr(PDA);
  // user_ata = createPublicKeyFromStr(USER_ATA);
  user = Keypair.fromSecretKey(bs58.decode(USER_PRIVATEKEY));
  payee = createPublicKeyFromStr(PAYEE);
  token_mint = createPublicKeyFromStr(TOKEN_MINT);
  vault_ata = createPublicKeyFromStr(VAULT_ATA);
  vault = Keypair.fromSecretKey(bs58.decode(VAULT));

  await swapBabySwap(
    connection,
    user,
    payee,
    token_mint,
    vault_ata,
    vault,
    // user_ata,
    // pda,
  );
  console.log("Token transfer succeeded!");
}


main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);