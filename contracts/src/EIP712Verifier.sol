// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IERC1271} from "./interfaces/IERC1271.sol";
import {IERC6492} from "./interfaces/IERC6492.sol";

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

struct Person {
    string name;
    address wallet;
    string message;
}

contract EIP712Verifier is EIP712 {
    using ECDSA for bytes32;

    IERC6492 public immutable ERC6492_SIG_VALIDATOR;

    bytes32 private constant _ERC6492_DETECTION_SUFFIX =
        0x6492649264926492649264926492649264926492649264926492649264926492;
    bytes32 private constant _PERSON_TYPEHASH = keccak256(bytes("Person(string name,address wallet,string message)"));

    // TODO for @dev: customize EIP712 domain in constructor e.g. EIP712("Sequence Signature Validation Demo","1")
    constructor(address erc6492SigValidator) EIP712("Sequence Signature Validation Demo","1") {
        ERC6492_SIG_VALIDATOR = IERC6492(erc6492SigValidator);
    }

    /// @dev Verifies the signature of a person.
    function verifySignature(address signer, Person memory person, bytes calldata signature)
        external
        returns (bool success)
    {
        bytes32 digest = personDigest(person);
        return ERC6492_SIG_VALIDATOR.isValidSig(signer, digest, signature);
    }

    /// @dev Returns the EIP712 hash of a person.
    function personDigest(Person memory person) public view returns (bytes32 digest) {
        bytes32 structHash = keccak256(
            abi.encode(_PERSON_TYPEHASH, keccak256(bytes(person.name)), person.wallet, keccak256(bytes(person.message)))
        );
        digest = EIP712._hashTypedDataV4(structHash);
    }

    /// @dev Exposes the EIP712 domain separator.
    function domainSeparator() external view returns (bytes32) {
        return EIP712._domainSeparatorV4();
    }
}
