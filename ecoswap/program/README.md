# Ecoswap Program :superhero_man: :handshake: 
This folder contains a custom Rust contract that orchestrates cross-contract calls and performs a 1:1 SOL &rarr; ECOV tokenswap. We were able to perform 3 sequential tasks in one unified transaction and this was possible through 3 distinct and sequential cross-program-invocations (CPIs). Let George be a hypothetical *ecoverse* user. Then our program does:


- **CPI #1** <br/> 
  **invoke the System Program** <br/>
  transfers SOL from Gerorge's wallet to BBox's beneficiary account
- **CPI #2** <br/> 
  **invoke the Associated Token Account Program** <br/>
  creates (idempotent) George's ATA
- **CPI #3** <br/> 
  **invoke the Token Program** <br/>
  send ECOV (or any SPL-token) to George's ATA

---

### :package: Requirements
Rust and npm or yarn.

### :old_key: .env
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

### Cargo.toml

Are you unable to compile your Rust smart contract code? It could be caused by the compiletime error saying
```diff
- error: the #[global_allocator] in this crate conflicts with global allocator in: spl_token
```
Fix it by correctly importing the `spl-token` crate into your `Cargo.toml` file, by adding the line

```bash
spl-token = { version="3.5.0", features = [ "no-entrypoint" ] }
```


