# ECOV Token Re-Mint :hammer_and_pick:

This directory allows the **update authority** of an SPL-token to mint more tokens from a preexisting token mint account. To do so, it runs a Solana native JavaScript module that re-mints SPL-tokens from the preexisting token mint account, whose public key is passed to the module as an environment variable.

---

### :unlock: .env
```bash
SOLANA_NETWORK=devnet
MINT_AMOUNT=integer
TOKEN_MINT=<token_mint_address>
PAYER=<privatekey>
FREEZE_AUTHORITY=<privatekey>
MINT_AUTHORITY=<privatekey>
```

### :gear: Run
To remint SPL-tokens:
- populate the `.env` file with the correct variables
    - `PAYER` must be the private key of the token's **update authority**
    - `MINT_AMOUNT` is the token quantity you want to mint now
- from this repo run in terminal `node remint.mjs`