# Program Instructions :memo: :date:

To interact with the Solana Program, you'll need to pass
 - programId
 - account keys
 - the data (transfer amount). <br> 

The accounts keys are required in this exact order and are:
```bash
user                            # (secretkey - signer) Ecoverse user requesting ECOV
payee                           # (pubkey) Ecoverse wallet cashing in SOL payments
SystemProgram                   # (programId) Solana's System Program
token_mint                      # (pubkey) ATA of the account that minted ECOV
TokenProgram                    # (programId) Solana's Token Program
AssociatedTokenProgram          # (programId) Solana's Associated Token Account
vault                           # (secretkey - signer) the ECOV owner
vault_ata                       # (pubkey) the ECOV holder: ATA derived from 'vault'
user_ata                        # (pubkey) derived synamically in the TypeScript frontend
```
> This transaction has 2 signers. These signers are the 2 accounts with secret keys. The user signs to authorize the transfer of SOL out of his wallet. The vault signs to transfer ECOV from itself into the user's ATA.