import abi from "./contract/chai.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Buy from "./components/Buy";
import Memos from "./components/Memos";
import chai from "./chai.png";
import "./App.css";

function App() {
  const [state, setState] = useState({ provider: null, signer: null, contract: null });
  const [account, setAccount] = useState("None");

  useEffect(() => {
    async function connectWallet() {
      const contractAddress = "0xa2c7caef4aa9a3da0eaed89c70efff1b8818a156";
      const contractABI = abi.abi;

      try {
        const { ethereum } = window;
        if (ethereum) {
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);

          setAccount(accounts[0]);
          setState({ provider, signer, contract });

          ethereum.on("chainChanged", (_chainId) => window.location.reload());
          ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length === 0) {
              console.log("Please connect to MetaMask.");
            } else {
              setAccount(accounts[0]);
            }
          });
        } else {
          alert("Please install MetaMask to use this app.");
        }
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    }

    connectWallet();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <img src={chai} alt="Chai Logo" className="logo" />
        <h1>Welcome to EtherChai</h1>
        <p>Connected Account: <span className="account">{account}</span></p>
      </header>
      <main className="container">
        <Buy state={state} />
        <Memos state={state} />
      </main>
    </div>
  );
}

export default App;
