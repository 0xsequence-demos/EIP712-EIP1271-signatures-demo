import './App.css'
import {ethers }from 'ethers'
import {sequence} from '0xsequence'
import { ABI } from './abi'

const VERIFYING_CONTRACT_ADDR = '0xf54A3F9f7d2fC072c0F511B79bFe0BE3812dF0A8'

interface Person {
  name: string;
  wallet: string;
}

function App() {
  sequence.initWallet('AQAAAAAAAJbeftY2hQWuQG48gxVfoHYXKcw', {defaultNetwork:'base-sepolia'})
  const submitSignature = async () => {
    // const = sequence.
    const wallet = sequence.getWallet()
    console.log("wallet", wallet.getAddress())

    const person: Person = {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
    }

    const chainId = await wallet.getChainId() ?? 84532
    console.log("chainId", chainId)

    const typedData: sequence.utils.TypedData = {
      domain: { // Domain settings must match verifying contract
        name: "Ether Mail",
        version: "1",
        chainId,
        verifyingContract: VERIFYING_CONTRACT_ADDR,
      },
      types: {
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" },
        ],
      },
      message: person,
      primaryType: "Person",
    };
    const signer = wallet.getSigner();
     
    const signature = await signer.signTypedData(
      typedData.domain,
      typedData.types,
      typedData.message,
      {
        chainId,
        eip6492: true,
      }
    );
    console.log(signature); // Is the type wrong for a signature? This isn't a string.

    const wallet1 = sequence.getWallet()
    const details = wallet1.connect({app:'signature validation'})
    const message = 'message'

    const messageHash = ethers.hashMessage(JSON.stringify(typedData));
    console.log(messageHash)

    // const wallet = sequence.getWallet()
    // console.log(wallet)
    // const signer = wallet.getSigner(84532)
    // console.log(signer)

    // const signature = await signer.signMessage(messageHash)
    
    // console.log(signature)
    console.log(await checkSignatureValidity(await wallet.getAddress(), person, signature.result))
  }

  async function checkSignatureValidity(address:string, person: Person, signature: string): Promise<boolean> {
    const provider = new ethers.JsonRpcProvider('https://nodes.sequence.app/base-sepolia/AQAAAAAAAJbeftY2hQWuQG48gxVfoHYXKcw');

    // Contract address and signer address (update with your actual contract and signer address)
    const contract = new ethers.Contract(VERIFYING_CONTRACT_ADDR, ABI, provider);
    console.log("signature", signature)
      try {
        const data = contract.interface.encodeFunctionData('verifySignature', [address, person, signature])
        console.log("data", data)
          // Call the `isValidSignature` function from the contract
          const result = await contract.verifySignature(
            address,
            person,
            signature
          );
          console.log(`Signature is ${result ? "valid" : "invalid"}`);
          return result;
      } catch (error) {
        console.error("Error calling isValidSignature:", error);
      }
      return false;
  }

  return (
    <>
      <button onClick={() => submitSignature()}>verify signature</button>
    </>
  )
}

export default App
