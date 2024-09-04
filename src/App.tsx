import { useState } from 'react'
import './App.css'
import {ethers }from 'ethers'
import {sequence} from '0xsequence'

const abi = [
  'function verifySignature(address walletAddress, bytes32 _hash, bytes calldata signature_) view external returns (bytes4)'
];

function App() {

  sequence.initWallet('AQAAAAAAAJbeftY2hQWuQG48gxVfoHYXKcw', {defaultNetwork:'base-sepolia'})
  const submitSignature = async () => {
    // const = sequence.
    const wallet: any = sequence.getWallet()

    const typedData: sequence.utils.TypedData = {
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: await wallet.getChainId(),
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      types: {
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" },
        ],
      },
      message: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
    };
     
    const signer = wallet.getSigner();
     
    const signature = await signer.signTypedData(
      typedData.domain,
      typedData.types,
      typedData.message
    );
    console.log(signature);

    const wallet1 = sequence.getWallet()
    const details = wallet1.connect({app:'signature validation'})
    const message = 'message'
    console.log(sequence)

    const messageHash = ethers.hashMessage(JSON.stringify(typedData));
    console.log(messageHash)

    // const wallet = sequence.getWallet()
    // console.log(wallet)
    // const signer = wallet.getSigner(84532)
    // console.log(signer)

    // const signature = await signer.signMessage(messageHash)
    
    // console.log(signature)
    console.log(await checkSignatureValidity(await wallet.getAddress(), messageHash, signature.result))
  }

  async function checkSignatureValidity(address:string, hash: any, signature: any) {
    const provider = new ethers.JsonRpcProvider('https://nodes.sequence.app/base-sepolia/AQAAAAAAAJbeftY2hQWuQG48gxVfoHYXKcw');

    // Contract address and signer address (update with your actual contract and signer address)
    const contractAddress = "0x68680bc16af8f0b29471bc3196d7cbb7248810a2";
    const contract = new ethers.Contract(contractAddress, abi, provider);
    console.log(signature)
      try {
          // Call the `isValidSignature` function from the contract
          const MAGICVALUE = "0x1626ba7e"; // ERC1271 magic value for valid signature
          const result = await contract.verifySignature(address, hash, signature);
          console.log(result)
          if (result === MAGICVALUE) {
            return true
              console.log("Signature is valid!");
          } else {
            return false
              console.log("Signature is invalid!");
          }
      } catch (error) {
        console.log(error)
          console.error("Error calling isValidSignature:", error);
      }
  }

  return (
    <>
      <button onClick={() => submitSignature()}>verify signature</button>
    </>
  )
}

export default App
