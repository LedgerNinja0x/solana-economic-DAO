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
use std::convert::TryInto;


entrypoint!(process_instruction);


pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    input: &[u8],
) -> ProgramResult {

    let acc_iter = &mut accounts.iter();
    let payer = next_account_info(acc_iter)?;
    let payee = next_account_info(acc_iter)?;  

    let amount = input
        .get(..8)
        .and_then(|slice| slice.try_into().ok())
        .map(u64::from_le_bytes)
        .ok_or(ProgramError::InvalidInstructionData)?;

    msg!("Request to transfer {:?} SOL from {:?} to {:?}",
    amount, payer.key, payee.key);
    msg!("Transfer in progress...");

    // Transfer from PAYER to PAYEE a specific amount
    invoke(
        &system_instruction::transfer(payer.key, payee.key, amount),
        &[payer.clone(), payee.clone()],
    )?;

    msg!("Transfer succeeded!");
    Ok(())
}
