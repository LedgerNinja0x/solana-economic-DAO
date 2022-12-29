# Ecoswap Program :superhero_man: :handshake: 
This folder contains a custom Rust contract that orchestrates cross-contract calls and performs a 1:1 SOL &rarr; ECOV tokenswap. To do so, it invokes the PDA and manages transfers of both Solana native tokens (SOL) and SPL tokens (ECOV) at once!

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