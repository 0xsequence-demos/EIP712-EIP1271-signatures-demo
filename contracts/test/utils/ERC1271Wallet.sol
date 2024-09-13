// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.26;

import {IERC1271} from "../../src/interfaces/IERC1271.sol";

contract ERC1271Wallet is IERC1271 {
    bytes32 public validHashedDigestSignature;

    function setValidSignature(bytes32 digest, bytes calldata signature) external {
        validHashedDigestSignature = keccak256(abi.encodePacked(digest, signature));
    }

    function isValidSignature(bytes32 digest, bytes calldata signature) external view override returns (bytes4) {
        if (validHashedDigestSignature == keccak256(abi.encodePacked(digest, signature))) {
            return IERC1271.isValidSignature.selector;
        }
        return bytes4(0);
    }
}
