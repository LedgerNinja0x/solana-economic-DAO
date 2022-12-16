use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program::{invoke},
    program_error::ProgramError,
    system_instruction,
    msg,
};
use spl_token::instruction;
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
    let user = next_account_info(acc_iter)?; // ecoverse user requesting ECOV
    let payee = next_account_info(acc_iter)?; // gerry = BBox cash-in account
    let ecov_program = next_account_info(acc_iter)?; // ECOV token program id
    let ecov_pool = next_account_info(acc_iter)?; // gigi = wallet owning ECOV 
    let pda = next_account_info(acc_iter)?; // program-derived-account owning gigi


    // deserialized byte array (8 bytes) into an integer
    let amount = input
        .get(..8)
        .and_then(|slice| slice.try_into().ok()) //lambda: turn slice to int
        .map(u64::from_le_bytes)
        .ok_or(ProgramError::InvalidInstructionData)?;

    msg!("Request to recieve {:?} ECOV from user {:?}",
    amount, user.key);
    msg!("Transfer in progress...");

    // Cross program invocations
    // SOL transfer from USER to PAYEE
    invoke(
        &system_instruction::transfer(user.key, payee.key, amount),
        &[user.clone(), payee.clone()],
    )?;
    msg!("SOL transfer succeeded!");


    // ECOV transfer from ECOV POOL to USER
    invoke_signed(
        &instruction::transfer(
            ecov_program.key,
            ecov_pool.key,
            user.key,
            pda.key,
            &[],
            amount
        )?,
        &[ecov_pool.clone(), user.clone(), pda.clone()],
        &[
            &[b"your", b"seeds", b"here",] // enter seed here
        ]
    )?;
    msg!("ECOV transfer succeeded!");

    // finally
    Ok(())
}