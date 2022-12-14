import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import { readFileSync } from "fs";
import path from 'path';
// require('dotenv').config();
import { config } from "dotenv";
config();

const lo = require("buffer-layout");


/**
 * VARS
 */
const SOLANA_NETWORK = process.env.SOLANA_NETWORK;

let connection: Connection;
let programKeypair: Keypair;
let programId: PublicKey;

let tamar: Keypair;
let rahab: Keypair;
let ruth: Keypair;
let bathsheba: Keypair;


/**
 * HELPER FUNC
 */
function createKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(readFileSync(path, "utf-8")))
    )
}


/**
 * SEND SOL
 * Send lamports (i.e. nano SOL) using the Rust program
 * Interact with the program by sending the proper instructions
 */
async function sendLamports(from: Keypair, to: PublicKey, amount: number) {
    let data = Buffer.alloc(8)
    lo.ns64("value").encode(amount, data);

    let ins = new TransactionInstruction({
        keys: [
            {pubkey: from.publicKey, isSigner: true, isWritable: true},
            {pubkey: to, isSigner: false, isWritable: true},
            {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
        ],
        programId: programId,
        data: data,
    })

    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(ins),
        [from]
    );
}


/**
 * MAIN
 */
async function main() {
    connection = new Connection(
        'https:://api/{SOLANA_NETWORK}.solana.com', 'confirmed'
    );

    programKeypair = createKeypairFromFile(
        path.join(
            path.resolve(__dirname, '../_dist/program'),
            'program-keyapir.json'
        )
    );

    programId = programKeypair.publicKey;

    //Trial account addresses
    tamar = createKeypairFromFile(__dirname + "/../accounts/tamar.json");
    rahab = createKeypairFromFile(__dirname + "/../accounts/rahab.json");
    ruth = createKeypairFromFile(__dirname + "/../accounts/ruth.json");
    bathsheba = createKeypairFromFile(__dirname + "/../accounts/bathsheba.json");


    // // Airdrop some lamports to Rahab & Bathsheba
    // await connection.confirmTransaction(
    //     await connection.requestAirdrop(
    //         rahab.publicKey,
    //         LAMPORTS_PER_SOL,
    //     )
    // );
    // await connection.confirmTransactionConfig(
    //     await connection.requestAirdrop(
    //         bathsheba.publicKey,
    //         LAMPORTS_PER_SOL,
    //     )
    // );

    // Bathsheba sends 0.3 SOL to Rahab
    console.log("Bathsheba sends SOL to Rahab");
    console.log(`Bathsheba's pubkey = ${bathsheba.publicKey}$`);
    console.log(`Rahab's pubkey = ${rahab.publicKey}$`);
    await sendLamports(bathsheba, rahab.publicKey, 300000000);
}


main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
);