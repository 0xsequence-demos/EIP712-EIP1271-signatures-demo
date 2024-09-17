## Contracts

This directory contains the smart contracts for EIP-712 signature verification.

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Anvil

```shell
$ anvil
```

### Deploy

Copy `.env.sample` to `.env` and set your private key.

```shell
$ forge create -i --rpc-url <your_rpc_url> src/UniversalSignatureValidator.sol:UniversalSignatureValidator
$ forge create -i --rpc-url <your_rpc_url> src/EIP712Verifier.sol:EIP712Verifier --constructor-args <usv_address>
```
