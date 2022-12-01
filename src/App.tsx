import React, { useEffect, useState } from "react";
import { Wallet } from "fuels";
import fuel from '@fuel-js/wallet';
import "./App.css";
// Import the contract factory -- you can find the name in index.ts.
// You can also do command + space and the compiler will suggest the correct name.
import { CounterContractAbi__factory } from "./contracts";
// The address of the contract deployed the Fuel testnet
const CONTRACT_ID = "0x88cc0401b8fe17183471cfcac70686f6829f009cdd16c493a9e43316bddffddb";
//the private key from createWallet.js
const WALLET_SECRET = "0xd175766e585d1c3fd26054c61b628c629c3e8d814a65a8a48cd90a7a6491acb7";
// Create a Wallet from given secretKey in this case
// The one we configured at the chainConfig.json
const wallet = new Wallet(
    WALLET_SECRET,
    "https://node-beta-1.fuel.network/graphql"
);
console.log(wallet)
// Connects out Contract instance to the deployed contract
// address using the given wallet.
 const contract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet);
// console.log("Fake wallet Contract", contract)
function App() {
  useEffect(()=>{
    async function getWallet(){
      let wallet1 = await ((window as any).FuelWeb3.getWallet("fuel1wmqhmnhy6ptcqmlzd3rmknzytrx0dj85kwykdnnq07vlxqdh5pnq2qa39k"))
      console.log(wallet1)
      let contract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet1)
      console.log("real wallet Contract", contract)
    }
    getWallet()
  })
  const [counter, setCounter] = useState(0);
  const [decrementLoading, setDecrementLoading] = useState(false);
  const [incrementLoading, setIncrementLoading] = useState(false);
  useEffect(() => {
    async function main() {
      // Executes the counter function to query the current contract state
      // the `.get()` is read-only, because of this it don't expand coins.
      const { value } = await contract.functions.counter().get();
      setCounter(Number(value));
    }
    main();
  }, []);
  async function increment() {
    // a loading state
    setIncrementLoading(true);
    // Creates a transactions to call the increment function
    // because it creates a TX and updates the contract state this requires the wallet to have enough coins to cover the costs and also to sign the Transaction
    try {
      await contract.functions.increment().txParams({ gasPrice: 1 }).call();
      const { value } = await contract.functions.counter().get();
      setCounter(Number(value));
    } finally {
      setIncrementLoading(false);
    }
  }
  async function decrement() {
    // a loading state
    setDecrementLoading(true);
    // Creates a transactions to call the increment function
    // because it creates a TX and updates the contract state this requires the wallet to have enough coins to cover the costs and also to sign the Transaction
    try {
      await contract.functions.decrement().txParams({ gasPrice: 1 }).call();
      const { value } = await contract.functions.counter().get();
      setCounter(Number(value));
    } finally {
      setDecrementLoading(false);
    }
  }
  return (
      <div className="App">
        <header className="App-header">
          <p>Counter: {counter}</p>
          <button disabled={incrementLoading} onClick={increment}>
            {incrementLoading ? "Incrementing..." : "Increment"}
          </button>
          <button disabled={decrementLoading} onClick={decrement}>
            {decrementLoading ? "Decrementing..." : "Decrement"}
          </button>
        </header>
      </div>
  );
}
export default App;
