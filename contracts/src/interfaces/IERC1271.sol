pragma solidity ^0.8.26;

// https://eips.ethereum.org/EIPS/eip-1271
interface IERC1271 {
    function isValidSignature(bytes32 _hash, bytes calldata _signature) external view returns (bytes4 magicValue);
}