# EcoSwap & DAO :postbox:
This Repo contains the codebase to mint, transfer, and use ECOV fungible tokens to pay for services on the *Ecoverse* dapp, developped by [BalloonBox](https://www.balloonbox.io/) for [Solana](https://solana.com/). As such, ECOV is the official utility token for *Ecoverse*. The major featured directories are

 - **ecoswap** <br/>
   a mechanism to swap SOL &rarr; ECOV unidirectionally <br/>
   completed - Milestone #1 deliverable :heavy_check_mark: 
 - **ecov** <br/>
   a minter of *Ecoverse*'s fungible utility tokens, called ECOV <br/>
   completed - Milestone #1 deliverable :heavy_check_mark: 
 - **dao** <br/>
   a DAO to vote on future Ecoverse projects <br/>
   Work In Progress - coming soon! :hourglass_flowing_sand: 
 - **pda** <br/>
   infrastructure only - please ignore

---

### Interaction Diagram

![](https://github.com/BalloonBox-Inc/ecoverse-dao/blob/dev/pix/interactions_diagram.png)

### Tree Diagram

The tree diagram of he *major* files in the current directory
```bash
.
├── dao                           
├── ecoswap
│   ├── _cicd
│   ├── _dist
│   │   └── program
│   └──  accounts
│       ├── bathsheba.json
│       ├── rahab.json
│       ├── ruth.json
│       └── tamar.json
│   ├── client
│   │   └── main.ts
│   ├── node_modules
│   └── program
│       └── src
│           ├── lib.rs
│           ├── Cargo.lock
│           └── Cargo.toml
│       └── target
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
|   └── README.md
├── ecov
│   ├── node_modules
│   └──  scripts
│       ├── rmint-token.mjs
│       └── ttransfer.mjs
│   ├── .env
│   ├── package-lock.json
│   └── package.json
├── pda
├── pix
├── .gitignore
├── LICENCE
└── README.md
```