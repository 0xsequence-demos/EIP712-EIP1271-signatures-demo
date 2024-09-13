import { InterfaceAbi } from "ethers/abi";

export const ABI: InterfaceAbi = [
	{
		"type": "constructor",
		"inputs": [
			{
				"name": "erc6492SigValidator",
				"type": "address",
				"internalType": "address"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "ERC6492_SIG_VALIDATOR",
		"inputs": [],
		"outputs": [
			{ "name": "", "type": "address", "internalType": "contract IERC6492" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "domainSeparator",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "eip712Domain",
		"inputs": [],
		"outputs": [
			{ "name": "fields", "type": "bytes1", "internalType": "bytes1" },
			{ "name": "name", "type": "string", "internalType": "string" },
			{ "name": "version", "type": "string", "internalType": "string" },
			{ "name": "chainId", "type": "uint256", "internalType": "uint256" },
			{
				"name": "verifyingContract",
				"type": "address",
				"internalType": "address"
			},
			{ "name": "salt", "type": "bytes32", "internalType": "bytes32" },
			{
				"name": "extensions",
				"type": "uint256[]",
				"internalType": "uint256[]"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "personDigest",
		"inputs": [
			{
				"name": "person",
				"type": "tuple",
				"internalType": "struct Person",
				"components": [
					{ "name": "name", "type": "string", "internalType": "string" },
					{ "name": "wallet", "type": "address", "internalType": "address" },
					{ "name": "message", "type": "string", "internalType": "string" }
				]
			}
		],
		"outputs": [
			{ "name": "digest", "type": "bytes32", "internalType": "bytes32" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "verifySignature",
		"inputs": [
			{ "name": "signer", "type": "address", "internalType": "address" },
			{
				"name": "person",
				"type": "tuple",
				"internalType": "struct Person",
				"components": [
					{ "name": "name", "type": "string", "internalType": "string" },
					{ "name": "wallet", "type": "address", "internalType": "address" },
					{ "name": "message", "type": "string", "internalType": "string" }
				]
			},
			{ "name": "signature", "type": "bytes", "internalType": "bytes" }
		],
		"outputs": [
			{ "name": "success", "type": "bool", "internalType": "bool" }
		],
		"stateMutability": "nonpayable"
	}
] as const
