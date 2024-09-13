pragma solidity ^0.8.26;

// https://eips.ethereum.org/EIPS/eip-6492
interface IERC6492 {
    function isValidSig(address signer, bytes32 hash, bytes calldata _signature) external returns (bool);
}