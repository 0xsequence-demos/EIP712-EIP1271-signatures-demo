import { sequence } from "0xsequence";
import { Card, TextInput, useTheme } from "@0xsequence/design-system";
import { ethers } from "ethers";
import { useState } from "react";
import { ABI } from "./abi";
import "./App.css";

const VERIFYING_CONTRACT_ADDR = "0x96943A020ad64BEfA01b208D4cc017AE8A6D0caE";

const DEFAULT_NETWORK = "base-sepolia";
const DEFAULT_NETWORK_CHAIN_ID = 84532;

interface Person {
  name: string;
  wallet: string;
  message: string;
}

function App() {
  const { setTheme } = useTheme();
  const [message, setMessage] = useState("asdf");
  const [signature, setSignature] = useState("");
  const [verified, setVerified] = useState<boolean | null>(null);

  sequence.initWallet("AQAAAAAAAJbeftY2hQWuQG48gxVfoHYXKcw", {
    defaultNetwork: DEFAULT_NETWORK,
  });
  setTheme("dark");
  const wallet = sequence.getWallet();

  const submitSignature = async () => {
    // const wallet = sequence.getWallet()
    console.log("wallet", wallet.getAddress());
    console.log("message", message);

    const person: Person = {
      name: "Bob",
      wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      message: message,
    };

    const chainId = (await wallet.getChainId()) ?? DEFAULT_NETWORK_CHAIN_ID;
    console.log("chainId", chainId);

    const typedData: sequence.utils.TypedData = {
      domain: {
        // Domain settings must match verifying contract
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

    try {
      const sig = await signer.signTypedData(
        typedData.domain,
        typedData.types,
        typedData.message,
        {
          chainId,
          eip6492: true,
        }
      );
      console.log("sig", sig);
      setSignature(sig);
      const result = await checkSignatureValidity(
        await wallet.getAddress(),
        person,
        sig
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
      "https://nodes.sequence.app/base-sepolia/AQAAAAAAAJbeftY2hQWuQG48gxVfoHYXKcw"
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
      <h2>EIP 712 Typed Onchain Verification & 1271 Signatures</h2>
      <p>
        verify a typed message against an onchain contract on{" "}
        <span style={{ color: "yellow" }}>sepolia</span>
      </p>
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
          <p style={{ wordBreak: "normal" }}>{signature}</p>
        </Card>
      )}
    </>
  );
}

export default App;
