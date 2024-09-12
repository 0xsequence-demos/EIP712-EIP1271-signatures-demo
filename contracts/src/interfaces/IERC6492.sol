// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC6492 {
    function isValidSig(address signer, bytes32 hash, bytes calldata _signature) external returns (bool);
}
