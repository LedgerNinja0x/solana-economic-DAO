# EcoSwap :evergreen_tree: :herb: :four_leaf_clover:
A unidirectional mechanism to swap 1:1 SOL &rarr; ECOV tokens. <br/> The infrastructure allowing for such a tokenswap comprises of:
- an custom designed on-chain Solana Rust program
- a TypeScript client passing instructions to the program
  
both of which are contained in this repo.

---

### :page_facing_up: About

Assume an *Ecoverse* user, named George, wants to convert some SOL tokens into ECOV tokens. <br/> This repo handles the logic to allow given tokenswap.
- Rust program <br/>
    It performs 3 consecutive actions:
    - transfer SOL from user George's's wallet address to a cash-in account
    - check whether George already owns an ATA, and creates a new ATA is he doesn't
    - transfer ECOV from ECOV liquidity pool (ATA) to user George's ATA

- TypeScript client<br/>
    - passes all the needed public keys and secret keys as instructions to the Rust program
    - executes the program logic to actually transfer funds around on the Solana blockchain


### :package: Requirements 
Rust and npm or yarn.

### :unlock: .env
Create an `.env` file with these variables
```bash
SOLANA_NETWORK="devnet"                                      # devnet
PAYEE=<publickey_to_cashin_sol_token>                        # any publickey: SOL recipient
TOKEN_MINT=<token_mint_account_of_ECOV_token>                # token_mint_account of your SPL-token
USER_PRIVATEKEY=<recipient_secretkey>                        # Phantom wallet 1: SOL sender and ECOV recipient
VAULT_PRIVATEKEY=<sender_secretkey>                          # Phantom wallet 2: ECOV transfer signer
VAULT_ATA=<publickey_of_sender_associated_token_account>     # Phantom wallet 2: ECOV sender
VAULT_ATA=<publickey_of_s
```


### :gear: Run 
Compile the Rust program and deploy it to blockchain, run in terminal
```bash
npm run reset-and-build
```
Save the ProgramId returned by the command above. In a *different* terminal, spin up a Solana event listener
```bash
solana logs | grep "<PROGRAM_ID> invoke" -A 15             
```
Now, run the TypeScript client and swap tokens
```bash
npm run simulation                                
```
This triggers a command inside _cicd/cicd.sh to run the .ts client file and simulate a transaction on Solana devnet. Check your [Phantom](https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa?hl=en) wallet and [Solscan](https://solscan.io/) to view the transaction.