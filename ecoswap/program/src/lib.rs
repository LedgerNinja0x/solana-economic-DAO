use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program::{invoke}, //invoke_signed
    program_error::ProgramError,
    system_instruction,
    msg,
};
// use spl_token;
use spl_associated_token_account;
use std::convert::TryInto;


entrypoint!(process_instruction);


// on-chain program instruction function
// functions arguments are just the Solana boilerplate ones
pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    input: &[u8],
) -> ProgramResult {

    // read accounts
    let acc_iter = &mut accounts.iter();
    // 1. Token account we hold
    let pda = next_account_info(acc_iter)?; // program-derived-account owning gigi
    // 2. Token account to send ECOV to
    let user = next_account_info(acc_iter)?; // ecoverse user requesting ECOV
    // 3. SPL-token holder account
    let ecov_vault = next_account_info(acc_iter)?; // wallet owning ECOV (e.g. gigi)
    // 4. SOL liquidity Cache
    let bbox_sol_payee = next_account_info(acc_iter)?; // gerry = BBox cash-in account
    // 5. SPL-token mint account
    let token_mint_account = next_account_info(acc_iter)?;
    // 6. Token Program
    let token_program = next_account_info(acc_iter)?; // Solana TokenProgram
    // 7. System program 
    let system_program = next_account_info(acc_iter)?; // Solana SystemProgram


    // deserialized byte array (8 bytes) into an integer
    let amount = input
        .get(..8)
        .and_then(|slice| slice.try_into().ok()) //lambda: turn slice to int
        .map(u64::from_le_bytes)
        .ok_or(ProgramError::InvalidInstructionData)?;

    msg!("Request to recieve {:?} ECOV from user {:?}",
    amount, user.key);
    msg!("SOL Transfer in progress...");

    // Cross program invocation:
    // SOL transfer from USER to PAYEE.
    // We multiply amount by 10^(-9), b/c the standard unit for SOL is Lamports,
    // whereas the stanrard unit for ECOV is the mere decimal system
    invoke(
        &system_instruction::transfer(user.key, bbox_sol_payee.key, amount*u64::pow(10, 9)),
        &[user.clone(), bbox_sol_payee.clone()],
    )?;
    msg!("SOL transfer succeeded!");


    /*
        Cross program invocation:
        create an ATA to dup ECOV into.
        Unlike a system transfer, for an spl-token transfer to succeed 
        the recipient must already have an Associated Token Account (ATA)
        compatible with the mint of that specific spl-token. 
        So create an ATA right now!
     */
    msg!("Create an ATA for the ECOV recipient");
    invoke(
        &spl_associated_token_account::instruction::create_associated_token_account(
            &user.key, //funding address
            &ecov_vault.key, //parent address for ATA derivation
            &token_mint_account.key,
            &token_program.key,
        ),
        &[user.clone(), ecov_vault.clone(), token_mint_account.clone(), token_program.clone(), system_program.clone()],
    )?;
    msg!("Fetching the created ATA");
    let ata = spl_associated_token_account::get_associated_token_address(
        &ecov_vault.key,
        &token_mint_account.key,
    );
    msg!("Retrieved ATA: {:?}", ata.to_string());


    // TO DO: add "if SOL transfer is successful, then transfer ECOV, else raise err"

    /*
        Cross program invocation:
        ECOV transfer from ECOV POOL to USER.
        Find a Program Derived Account (PDA) and call it escrow
        Deterministically derive the escrow pubkey
        let (escrow_pubkey, escrow_bump_seed) = Pubkey::find_program_address(&[&["BalloonBox", "-", "escrow"]], &ecov_program);
        To reduce the compute cost, use find_program_address() fn 
        off-chain and pass the resulting bump seed to the program.
        PDA addresses are indistinguishable from any other pubkey.
        The only way for the runtime to verify that the address belongs to a
        program is for the program to supply the seeds used to generate the address.
     */
    // msg!("ECOV Transfer in progress...");
    // invoke_signed(
    //     &spl_token::instruction::transfer(
    //         token_program.key,
    //         ecov_vault.key,
    //         ata,
    //         pda.key,
    //         &[],
    //         amount
    //     )?,
    //     &[ecov_vault.clone(), ata.clone(), pda.clone()],
    //     &[
    //         &[b"BalloonBox-", b"escrow"] //PDA seeds
    //     ]
    // )?;
    // msg!("ECOV transfer succeeded!");

    // finally
    Ok(())
}