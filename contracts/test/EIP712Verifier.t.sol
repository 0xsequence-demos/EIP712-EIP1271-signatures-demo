// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.26;

import {Test, stdError} from "forge-std/Test.sol";
import {EIP712Verifier, Person} from "../src/EIP712Verifier.sol";
import {UniversalSignatureValidator} from "../src/UniversalSigValidator.sol";
import {ERC1271Wallet} from "./utils/ERC1271Wallet.sol";

contract VerifierTest is Test {
    EIP712Verifier public verifier;
    ERC1271Wallet public signer;

    function setUp() public {
        address usv = address(new UniversalSignatureValidator());
        verifier = new EIP712Verifier(usv);
        signer = new ERC1271Wallet();
    }

    function test_verifySignature(Person calldata person, bytes calldata signature) public {
        bytes32 digest = verifier.personDigest(person);
        signer.setValidSignature(digest, signature);
        bool valid = verifier.verifySignature(address(signer), person, signature);
        vm.assertTrue(valid);
    }

    function test_verifySignatureInvalid(Person calldata person, bytes calldata signature) public {
        bool valid = verifier.verifySignature(address(signer), person, signature);
        vm.assertTrue(!valid);
    }
}
