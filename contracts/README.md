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
$ forge script script/Deploy.s.sol:Deploy --rpc-url <your_rpc_url> --broadcast
```

This will deploy the following:

| Contract                | Address                                      |
| ----------------------- | -------------------------------------------- |
| `UniversalSigValidator` | `0x15E8094b9Ba125f300b93165b908Eb1b08e1b053` |
| `EIP712Verifier`        | `0x96943A020ad64BEfA01b208D4cc017AE8A6D0caE` |
