# Ecoswap Program :superhero_man: :handshake: 

The custom Rust contract orchestrates cross-contract calls and performs a 1:1 SOL &rarr; ECOV tokenswap. We were able to perform 3 sequential tasks in one unified transaction and this was possible through 3 distinct and sequential cross-program-invocations (CPIs). Let George be a hypothetical *ecoverse* user. Then our program does the following:


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

### Cargo.toml

Are you unable to compile your Rust smart contract code? It could be caused by the compiletime error saying
```diff
- error: the #[global_allocator] in this crate conflicts with global allocator in: spl_token
```
Fix it by correctly importing the `spl-token` crate into your `Cargo.toml` file, by adding the line

```bash
spl-token = { version="3.5.0", features = [ "no-entrypoint" ] }
```


