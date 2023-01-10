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

    // Wallet address (keypair) requesting ECOV
    let user = next_account_info(acc_iter)?;
    // SOL liquidity Cache
    let payee = next_account_info(acc_iter)?;
    // Solana SystemProgram 
    let system_program = next_account_info(acc_iter)?;

    // SPL-token mint account
    let token_mint_account = next_account_info(acc_iter)?;
    // Solana TokenProgram
    let token_program = next_account_info(acc_iter)?;
    // Solana AssociatedTokenProgram
    let associated_token_program = next_account_info(acc_iter)?;

    // SPL-token account holder
    let vault = next_account_info(acc_iter)?;
    // PL-token account (ATA)
    let vault_ata = next_account_info(acc_iter)?;
    // User's ECOV token account (ATA)
    let user_ata = next_account_info(acc_iter)?;


    // deserialized byte array (8 bytes) into an integer
    let amount = input
        .get(..8)
        .and_then(|slice| slice.try_into().ok()) //lambda: turn slice to int
        .map(u64::from_le_bytes)
        .ok_or(ProgramError::InvalidInstructionData)?;

    msg!("Request to recieve {:?} ECOV from user {:?}",
    amount, user.key);
    msg!("SOL Transfer in progress...");


    /*
        Cross program invocation #1:
        SOL transfer from USER to PAYEE.
        We multiply amount by E-9, b/c the standard unit for SOL is Lamports,
        whereas the stanrard unit for ECOV is the mere decimal system
    */
    invoke(
        &system_instruction::transfer(user.key, payee.key, amount*u64::pow(10, 9)),
        &[user.clone(), payee.clone()],
    )?;
    msg!("SOL transfer succeeded!");
    msg!("Initialize user ATA for the ECOV recipient");
    // TO DO: add "if SOL transfer is insuccessful, raise err"



    // // Get your user_ata deterministically &
    // // ensure it's equal to the on eyou passed in
    // let ata:Pubkey = spl_associated_token_account
    //     ::get_associated_token_address(
    //     &user.key,
    //     &token_mint_account.key,
    // );

    /*
        Cross program invocation #2:
        create an ATA to send ECOV to.
        Unlike a system transfer, for an spl-token transfer to succeed 
        the recipient must already have an Associated Token Account (ATA)
        compatible with the mint of that specific spl-token. 
        SO, if the ATA doesn't exist yet, create it dynamically!
    */
    invoke(
    &spl_associated_token_account::instruction
    ::create_associated_token_account_idempotent(
        &user.key, //funding address
        &user.key, //parent address for ATA derivation
        &token_mint_account.key,
        &token_program.key,
    ),
    &[
        user.clone(),
        user_ata.clone(),
        user.clone(),
        token_mint_account.clone(),
        system_program.clone(),
        associated_token_program.clone(),
    ],
    )?;
    msg!("The user's ATA is = {:?}", user_ata.key);

    
    // //TO DO: derive the bump stored in the PDA itself. You'll need it to sign
    // let _bump: u64 = 255;
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
    msg!(
        "Transfer {} SPL-token from {:?} to {:?}",
        amount, vault_ata.key, user_ata.key
    );
    invoke(
        &spl_token::instruction::transfer(
            token_program.key,
            vault_ata.key,
            user_ata.key,
            vault.key,
            &[&vault.key], //the signer could be a PDA
            amount*u64::pow(10, 9),
        )?,
        &[
            vault_ata.clone(),
            user_ata.clone(),
            vault.clone(),
            token_program.clone(),

        ],
        // &[
        //     &[b"BalloonBoxEcov", &[bump]][..] //PDA seeds & bump
        // ],
    )?;
    msg!("SPL-token transfer succeeded!");

    // finally
    Ok(())
}