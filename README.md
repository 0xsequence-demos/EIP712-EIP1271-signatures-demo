# EIP712-EIP1271-signatures-demo
A simplified user interface for signing a message with a Sequence Universal Wallet and verifying the typed data on-chain using a 1271 verification signature, covering cases where the smart contract wallet is not deployed using static ethers calls to simulate a verification, deployed on sepolia.

## Technologies used
- EIP712 Typed Data
- EIP1271 Signature Validation
- EIP6492 Signature Validation for Predeploy Contracts
- ethers
- Sequence Universal Wallet
- React / Vite

## Quickstart
Install and run:

```shell
pnpm install && pnpm dev
```

The app will start on http://localhost:5173 
