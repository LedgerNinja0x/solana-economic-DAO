import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import { readFileSync } from "fs";
  
    // Users
    const PAYER_KEYPAIR = Keypair.generate();
    
//     let PAYER_KEYPAIR: Keypair;
//     /**
//      * HELPER FUNC
//      */
//     function createKeypairFromFile(path: string): Keypair {
//         return Keypair.fromSecretKey(
//             Buffer.from(JSON.parse(readFileSync(path, "utf-8")))
//         )
// } 
//     PAYER_KEYPAIR = createKeypairFromFile(__dirname + "/../accounts/rahab.json");
  

    (async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const programId = new PublicKey(
        "6eW5nnSosr2LpkUGCdznsjRGDhVb26tLmiM1P8RV1QQp"
        // ^| What address is the one used here above?
        // program_id of the EcoSwap token - currently using a random one
    );

    // Airdop to Payer
    await connection.confirmTransaction(
        await connection.requestAirdrop(PAYER_KEYPAIR.publicKey, LAMPORTS_PER_SOL)
    );

    const [pda, bump] = await PublicKey.findProgramAddressSync(
        [Buffer.from("seedyseed"), PAYER_KEYPAIR.publicKey.toBuffer()],
        programId
    );

    // print PDA info
    console.log(`PDA Pubkey: ${pda.toString()}`);
    console.log(`PDA Bump: ${bump.toString()}`);

    const createPDAIx = new TransactionInstruction({
    programId: programId,
    data: Buffer.from(Uint8Array.of(bump)),
    keys: [
        {
        isSigner: true,
        isWritable: true,
        pubkey: PAYER_KEYPAIR.publicKey,
        },
        {
        isSigner: false,
        isWritable: true,
        pubkey: pda,
        },
        {
        isSigner: false,
        isWritable: false,
        pubkey: SystemProgram.programId,
        },
    ],
    });

    const transaction = new Transaction();
    transaction.add(createPDAIx);

    const txHash = await connection.sendTransaction(transaction, [PAYER_KEYPAIR]);
    console.log(`Created PDA successfully. Tx Hash: ${txHash}`);
})();