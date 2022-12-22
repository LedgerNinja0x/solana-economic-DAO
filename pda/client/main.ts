import {
    clusterApiUrl,
    Connection,
    Keypair,
    // LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import path from 'path';
import { readFileSync } from "fs";
  
    // Users
    // const PAYER_KEYPAIR = Keypair.generate(); // <-- generate signer instead of importing one


    /**
     * HELPER FUNC
     */
    function createKeypairFromFile(path: string): Keypair {
        return Keypair.fromSecretKey(
            Buffer.from(JSON.parse(readFileSync(path, "utf-8")))
        )
    } 

    /**
     * VARS
     */
    const PAYER_KEYPAIR = createKeypairFromFile("/Users/irenefabris/.config/solana/id.json");
    // let programKeypair: Keypair;
    // let program_id: PublicKey;
  

    (async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    
    // programKeypair = createKeypairFromFile(
    //     path.join(
    //         path.resolve(__dirname, '../dist/program'),
    //         'pda-keypair.json'
    //     )
    // );
    // program_id = programKeypair.publicKey;
        
    const program_id = new PublicKey(
        "6eW5nnSosr2LpkUGCdznsjRGDhVb26tLmiM1P8RV1QQp"
        // ^| What address is the one used here above?
        // program_id of the EcoSwap token - currently using a random one
    );
        
    console.log(`Program Id = ${program_id.toString()}`);
    console.log(`PAYER_KEYPAIR = ${PAYER_KEYPAIR.publicKey.toString()}`);

    // // Airdop to Payer
    // await connection.confirmTransaction(
    //     await connection.requestAirdrop(PAYER_KEYPAIR.publicKey, LAMPORTS_PER_SOL)
    // );

    const [pda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from("customaddress"), PAYER_KEYPAIR.publicKey.toBuffer()],
        program_id
    );

    // print PDA info
    console.log(`PDA Pubkey: ${pda.toString()}`);
    console.log(`PDA Bump: ${bump.toString()}`);

    const createPDAIx = new TransactionInstruction({
    programId: program_id,
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