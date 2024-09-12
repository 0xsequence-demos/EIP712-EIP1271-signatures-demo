// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {SingletonDeployer, console} from "erc2470-libs/script/SingletonDeployer.s.sol";

import {EIP712Verifier} from "../src/EIP712Verifier.sol";
import {UniversalSigValidator} from "../src/UniversalSigValidator.sol";

contract Deploy is SingletonDeployer {
    function run() public {
        uint256 pk = vm.envUint("PRIVATE_KEY");

        bytes32 salt = bytes32(0);

        bytes memory initCode = type(UniversalSigValidator).creationCode;
        address usvAddr = _deployIfNotAlready("UniversalSigValidator", initCode, salt, pk);

        initCode = abi.encodePacked(type(EIP712Verifier).creationCode, abi.encode(usvAddr));
        _deployIfNotAlready("EIP712Verifier", initCode, salt, pk);
    }
}
