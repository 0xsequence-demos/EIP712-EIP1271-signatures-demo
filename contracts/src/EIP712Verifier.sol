// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ECDSA} from "solady/utils/ECDSA.sol";
import {EIP712} from "solady/utils/EIP712.sol";

interface IERC1271 {
    function isValidSignature(bytes32 _hash, bytes calldata _signature) external view returns (bytes4 magicValue);
}

interface IERC6492 {
    function isValidSig(address signer, bytes32 hash, bytes calldata _signature) external returns (bool);
}

struct Person {
    string name;
    address wallet;
}

contract EIP712Verifier is EIP712 {
    using ECDSA for bytes32;

    IERC6492 private constant _ERC6492_SIG_VALIDATOR = IERC6492(0xfd53862b1c8a2A00703e0E1579cD32C2B6c2f5F5); //FIXME Use cross chain supported addr
    bytes32 private constant _ERC6492_DETECTION_SUFFIX = 0x6492649264926492649264926492649264926492649264926492649264926492;
    bytes32 private constant _PERSON_TYPEHASH = keccak256(bytes("Person(string name,address wallet)"));

    /// @dev Verifies the signature of a person.
    function verifySignature(address signer, Person memory person, bytes calldata signature) external returns (bool success) {
        bytes32 digest = personDigest(person);
        return validateSigner(signer, digest, signature);
    }

    /// @dev Returns the EIP712 hash of a person.
    function personDigest(Person memory person) public view returns (bytes32 digest) {
        bytes32 structHash = keccak256(
            abi.encode(
                _PERSON_TYPEHASH,
                keccak256(bytes(person.name)),
                person.wallet
            )
        );
        digest = EIP712._hashTypedData(structHash);
    }

    /// @dev Validates the ERC1271 signature of a signer.
    function validateSigner(address signer, bytes32 digest, bytes calldata signature) internal returns (bool success) {
        bool isCounterfactual = bytes32(signature[signature.length-32:signature.length]) == _ERC6492_DETECTION_SUFFIX;
        if (isCounterfactual) {
            return _ERC6492_SIG_VALIDATOR.isValidSig(signer, digest, signature);
        }

        try IERC1271(signer).isValidSignature(digest, signature) returns (bytes4 magicValue) {
            return magicValue == IERC1271.isValidSignature.selector;
        } catch {}
        return false;
    }

    /// @dev Domain settings for EIP712.
    function _domainNameAndVersion() internal pure override returns (string memory name, string memory version) {
        name = "Ether Mail";
        version = "1";
    }

    /// @dev Exposes the EIP712 domain separator.
    function domainSeparator() external view returns (bytes32) {
        return EIP712._domainSeparator();
    }
}
