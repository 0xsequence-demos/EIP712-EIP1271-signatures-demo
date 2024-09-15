import { sequence } from "0xsequence";
import { Card, TextInput, useTheme } from "@0xsequence/design-system";
import { ethers } from "ethers";
import { useState } from "react";
import { ABI } from "./abi";
import "./App.css";

const VERIFYING_CONTRACT_ADDR = "0xB81efF8d6700b83B24AA69ABB18Ca8f9F7A356c5";
const RPC_URL = "https://nodes.sequence.app/sepolia/AQAAAAAAAJbeftY2hQWuQG48gxVfoHYXKcw"
const DEFAULT_NETWORK = "sepolia";
const DEFAULT_NETWORK_CHAIN_ID = 11155111;

interface Person {
  name: string;
  wallet: string;
  message: string;
}

function App() {
  const { setTheme } = useTheme();
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [message, setMessage] = useState("asdf");
  const [signature, setSignature] = useState("");
  const [verified, setVerified] = useState<boolean | null>(null);

  sequence.initWallet("AQAAAAAAAJbeftY2hQWuQG48gxVfoHYXKcw", {
    defaultNetwork: DEFAULT_NETWORK,
  });
  setTheme("dark");
  const wallet = sequence.getWallet();
  const signIn = async () => {
    
    const wallet = sequence.getWallet()
    const details = await wallet.connect({app: 'sequence signature validation demo'})
    
    if(details){
      console.log('is signed in')
      console.log(details)
      setIsSignedIn(true)
    }
    
  }

  const submitSignature = async () => {
    console.log("wallet", wallet.getAddress());
    console.log("message", message);

    const person: Person = {
      name: "user",
      wallet: wallet.getAddress(),
      message: message,
    };

    const chainId = (await wallet.getChainId()) ?? DEFAULT_NETWORK_CHAIN_ID;
    console.log("chainId", chainId);

    const typedData: sequence.utils.TypedData = {
      domain: {
        // Domain settings must match verifying contract
        name: "Sequence Signature Validation Demo",
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

    const signer = wallet.getSigner(DEFAULT_NETWORK_CHAIN_ID);

    try {
      const signature = await signer.signTypedData(
        typedData.domain,
        typedData.types,
        typedData.message,
        {
          chainId,
          eip6492: true,
        }
      );
      console.log("sig", signature);
      setSignature(signature);
      const result = await checkSignatureValidity(
        await wallet.getAddress(),
        person,
        signature
      );
      setVerified(result);
    } catch (err) {
      console.log(err);
    }
  };

  async function checkSignatureValidity(
    address: string,
    person: Person,
    signature: string
  ): Promise<boolean> {
    const provider = new ethers.JsonRpcProvider(
      RPC_URL
    );
    console.log(address, person, signature);
    const contract = new ethers.Contract(
      VERIFYING_CONTRACT_ADDR,
      ABI,
      provider
    );
    console.log("signature", signature);
    try {
      const data = contract.interface.encodeFunctionData("verifySignature", [
        address,
        person,
        signature,
      ]);
      console.log("data", data);
      console.log("checking on chain");
      // Call the `isValidSignature` function from the contract
      const result = await contract.verifySignature.staticCall(
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
      <h2>EIP 712 Typed On-chain Verification & 1271 Signatures</h2>
      <p>
        verify a typed message against an on-chain contract on{" "}
        <span style={{ color: "yellow" }}>{DEFAULT_NETWORK}</span>
      </p>
      {!isSignedIn && <button onClick={() => signIn()}>sign in</button>}
      {isSignedIn && <>
      <br />
      <Card>
        <TextInput
          placeholder="message"
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
            setMessage(evt.target.value);
          }}
        ></TextInput>
        <br />
        <br />
        <button onClick={() => submitSignature()}>verify signature</button>
        <br />
      </Card>
      <br />
      <br />
      {verified != null && (
        <Card>
          <br />
          <span>verified?</span>
          <span
            style={{ marginLeft: "20px", color: verified ? "lime" : "yellow" }}
          >
            {verified.toString()}
          </span>
          <p>signature</p>
          <p style={{ wordBreak: "break-word", maxWidth: '600px' }}>{signature.slice(0, 50)}...{signature.slice(signature.length - 50,signature.length)}</p>
        </Card>
      )}
      </>
    }     
    </>
  );
}

export default App;
