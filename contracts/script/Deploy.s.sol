// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {EIP712Verifier} from "../src/EIP712Verifier.sol";
import {UniversalSigValidator} from "../src/UniversalSigValidator.sol";

contract DeployVerifier is Script {
    EIP712Verifier public verifier;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        verifier = new EIP712Verifier();

        vm.stopBroadcast();
    }
}

contract DeployUniversalSigValidator is Script {
    UniversalSigValidator public validator;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // FIXME This should be deployed with a singleton factory
        validator = new UniversalSigValidator();

        vm.stopBroadcast();
    }
}
