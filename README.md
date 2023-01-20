# EcoSwap & DAO :postbox:
This Repo contains the codebase to mint, transfer, and use ECOV fungible tokens to pay for services on the *Ecoverse* dapp, developed by [BalloonBox](https://www.balloonbox.io/) for [Solana](https://solana.com/). As such, ECOV is the official utility token for *Ecoverse*. The major featured directories are

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

The tree diagram of the *major* files in the current directory
```bash
.
├── dao                             # coming soon
├── ecoswap                         # unidirectional 1:1 swap SOL -> ECOV
│   ├── _cicd                       # shell custom commands
│   ├── _dist                       # contains the outputs of the compiled Solana program 
│   │   └── program
│   └──  accounts                   # a folder containing a few Solana file system wallets
│       ├── bathsheba.json          # keypairs for the file system wallet
│       ├── rahab.json
│       ├── ruth.json
│       └── tamar.json
│   ├── client                      # Typescript client that interacts with the Solana program
│   │   └── main.ts
│   ├── node_modules                # node.js dependencies
│   └── program                     # the actual Solana program
│       └── src
│           ├── lib.rs              # Rust codebase of the Solana program
│           ├── Cargo.lock          # auto-generated Rust dependencies file
│           └── Cargo.toml          # Rust manifest file
│       └── target                  # output of the compiled Solana program
│   ├── .env                        # environment variables
│   ├── .gitignore                  
│   ├── package-lock.json           # auto-generated Node project metadata
│   ├── package.json                # metadata of our Node project
|   └── README.md
├── ecov                            # mint and transfer a utility token, called ECOV
│   ├── firstmint                   # first-time mint of ECOV
│       ├── node_modules
│       └──  scripts
│           ├── firstmint.mjs       # mint ECOV (SPL-token)
│           └── transfer.mjs        # transfer ECOV
│       ├── .env
│       ├── package-lock.json
│       ├── package.json
│       └── README.md
│   └── remint                      # remint existing supply of ECOV
│       ├── node_modules
│       ├── .env
│       ├── .gitignore              
│       ├── package-lock.json
│       ├── package.json
│       ├── README.md
│       └── remint.mjs
├── pda                             # Program Derived Address (PDA)
├── pix                             # images & diagrams
├── .gitignore
├── LICENCE
└── README.md
```