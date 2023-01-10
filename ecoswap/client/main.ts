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
  ASSOCIATED_TOKEN_PROGRAM_ID,
  } from "@solana/spl-token";
import path from 'path';
import { readFileSync } from "fs";
import * as bs58 from 'bs58';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * VARS
 */
const TOKEN_TRANSFER_AMOUNT = 0.1;
const PAYEE = process.env.PAYEE as string;
const VAULT_ATA = process.env.VAULT_ATA as string;
const TOKEN_MINT = process.env.TOKEN_MINT as string;
const SOLANA_NETWORK = process.env.SOLANA_NETWORK;
const USER_PRIVATEKEY = process.env.USER_PRIVATEKEY as string;
const VAULT_PRIVATEKEY = process.env.VAULT_PRIVATEKEY as string;

const lo = require("buffer-layout");
// const PDA = process.env.PDA as string;
// const USER_ATA = process.env.USER_ATA as string;

let user: Keypair;
let vault: Keypair;
let payee: PublicKey;
let user_ata: PublicKey;
let vault_ata: PublicKey;
let programId: PublicKey;
let token_mint: PublicKey;
let connection: Connection;
let programKeypair: Keypair;


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
 * Derive the Associated Token Account (ATA)
 * from a wallet_address and a token mint account
 */
async function findAssociatedTokenAddress(
  wallet_address: PublicKey,
  token_mint: PublicKey
): Promise<PublicKey> {
  return (await PublicKey.findProgramAddress(
      [
          wallet_address.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          token_mint.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
  ))[0];
}


/**
 * SWAP SOL-> ECOV
 * Send x-SOL and recieve x-ECOV
 */
async function swapSOLforSPLtoken(
      connection: Connection,
      user: Keypair,
      payee: PublicKey,
      token_mint: PublicKey,
      vault: Keypair,
      vault_ata: PublicKey,
      user_ata: PublicKey,
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
        pubkey: payee,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: SystemProgram.programId,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: token_mint, // ATA
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: TOKEN_PROGRAM_ID, 
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: vault.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: vault_ata, // ATA
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: user_ata,
      },
      // {
      //   isSigner: false,
      //   isWritable: true,
      //   pubkey: pda, // PDA
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
  user = Keypair.fromSecretKey(bs58.decode(USER_PRIVATEKEY));
  payee = createPublicKeyFromStr(PAYEE);
  token_mint = createPublicKeyFromStr(TOKEN_MINT);
  vault_ata = createPublicKeyFromStr(VAULT_ATA);
  vault = Keypair.fromSecretKey(bs58.decode(VAULT_PRIVATEKEY));
  user_ata = await findAssociatedTokenAddress(user.publicKey, token_mint);

  // user = createKeypairFromFile(__dirname + USER_PRIVATEKEY);
  // pda = createPublicKeyFromStr(PDA);
  // user_ata = createPublicKeyFromStr(USER_ATA);

  await swapSOLforSPLtoken(
    connection,
    user,
    payee,
    token_mint,
    vault,
    vault_ata,
    user_ata,
    // pda,
  );
  console.log("ATA fetched succeeded!");
}


main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);