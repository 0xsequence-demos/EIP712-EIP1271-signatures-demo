import './App.css'
import {useState} from 'react'
import {ethers }from 'ethers'
import {sequence} from '0xsequence'
import { ABI } from './abi'
import { Card, TextInput, useTheme } from '@0xsequence/design-system'

const VERIFYING_CONTRACT_ADDR = '0xf54A3F9f7d2fC072c0F511B79bFe0BE3812dF0A8'

interface Person {
  name: string;
  wallet: string;
  message: string;
}

function App() {
  const  {setTheme} = useTheme()
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState('')
  const [verified, setVerified] = useState<any>(null)

  sequence.initWallet('AQAAAAAAAJbeftY2hQWuQG48gxVfoHYXKcw', { defaultNetwork:'base-sepolia' })
  setTheme('dark')
  const submitSignature = async () => {
    const wallet = sequence.getWallet()
    const details = await wallet.connect({app: 'verification'})
    console.log(details)
    // const wallet = sequence.getWallet()
    console.log("wallet", wallet.getAddress())
    console.log("message", message)

    const person: Person = {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      message: message
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
          { name: "message", type: "string" },
        ],
      },
      message: person,
      primaryType: "Person",
    };

    const signer = wallet.getSigner(84532);
     
    try{
      console.log(
        typedData.domain,
        typedData.types,
        typedData.message,
        {
          chainId,
          eip6492: true,
        }
      )
      const signature = await signer.signTypedData(
        typedData.domain,
        typedData.types,
        typedData.message,
        {
          chainId,
          eip6492: false,
        }
      );
      console.log(signature); 
    }catch(err){
      console.log(err)
    }
// Is the type wrong for a signature? This isn't a string.

    // const wallet1 = sequence.getWallet()
    // const details = wallet1.connect({app:'signature validation'})
    // const message = 'message'

    setMessage(message)
    const messageHash = ethers.hashMessage(JSON.stringify(typedData));
    console.log(messageHash)
    setSignature(messageHash)
    setVerified(false)

    // const wallet = sequence.getWallet()
    // console.log(wallet)
    // const signer = wallet.getSigner(84532)
    // console.log(signer)

    // const signature = await signer.signMessage(messageHash)
    // console.log(signature)

    // console.log(await wallet.getAddress(), person, signature.result)
    // console.log(await checkSignatureValidity(await wallet.getAddress(), person, signature.result))
  }

  async function checkSignatureValidity(address:string, person: Person, signature: string): Promise<boolean> {
    const provider = new ethers.JsonRpcProvider('https://nodes.sequence.app/base-sepolia/AQAAAAAAAJbeftY2hQWuQG48gxVfoHYXKcw');
    console.log(address, person, signature)
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
      <h2>EIP 712 Typed Onchain Verification & 1271 Signatures</h2>
      <p>verify a typed message against an onchain contract on <span style={{color: 'yellow'}}>sepolia</span></p>
      <br/>
      <Card>
        <TextInput placeholder="message" onChange={(evt: any) => {setMessage(evt.target.value)}}></TextInput>
        <br/>
        <br/>
        <button onClick={() => submitSignature()}>verify signature</button>
        <br/>
        </Card>
        <br/>
        <br/>
          {verified != null && 
          <Card>
          <br/>
          <span>verified?</span><span style={{marginLeft: '20px', color: verified ? 'lime' : 'yellow'}}>{verified.toString()}</span>
          <p>signature</p>
          <p style={{wordBreak: 'normal'}}>{signature}</p>
          </Card>
        }
    </>
  )
}

export default App
