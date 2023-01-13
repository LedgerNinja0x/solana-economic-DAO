# ECOV Token Program :octocat:

This directory contains a JavaScript module that mints SPL-tokens on Solana and transfer them to an ECOV liquidity pool (token account). 
We built it using the [thirdweb Solana SDK](https://portal.thirdweb.com/solana) (JavaScript) to send a CPI to Solana native [Token Program](https://spl.solana.com/token) mint a batch of SPL-token, which we named ECOV.
The module is executed one-off for the initial mint of ECOV which is the utility token used by our *Ecoverse* dapp. In case of a shortage of ECOV supply, the designated update authority can mint more tokens in the future, as needed.

---

Token Program Address (search on [solscan.io](https://solscan.io/) ):
- devnet `7MYTw8bq2Cq5WwXQREBqUHJP4hqPqsPeWyMxujgT98xW`
- mainnet `{{comint_soon}}`