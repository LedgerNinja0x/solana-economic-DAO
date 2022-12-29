# Generate a Program Derived Address :open_file_folder:

After minting teh ECOV spl-token via the Solana Token Program, derive a program address from the program id where ECOV tokens are held. Then grant the PDA owner permission over the ECOV liquidity pool wallet. This is a prerequisite for allowing SOL &rarr; ECOV swaps.

---


### Cargo.toml

Are you unable to compile your Rust smart contract code? It could be caused by the compiletime error saying 
```
*error: the `#[global_allocator]` in this crate conflicts with global allocator in: spl_token*
```
Fix it by correctly importing the `spl-token` crate into your `Cargo.toml` file, by adding the line

```bash
spl-token = { version="3.5.0", features = [ "no-entrypoint" ] }
```

