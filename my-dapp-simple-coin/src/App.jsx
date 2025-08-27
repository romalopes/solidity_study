import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";
import TxList from "./TxList";
import { useMetamask } from "./useMetamask";

function App() {
  // useEffect(() => {
  //   if (contractInfo.address !== "-") {
  //     contract.on("Transfer", (from, to, amount, event) => {
  //       console.log({ from, to, amount, event });

  //       setTxs((currentTxs) => [
  //         ...currentTxs,
  //         {
  //           txHash: event.transactionHash,
  //           from,
  //           to,
  //           amount: String(amount),
  //         },
  //       ]);
  //     });
  //     setContractListened(contract);

  //     return () => {
  //       contractListened.removeAllListeners();
  //     };
  //   }
  // }, [contractInfo.address]);

  // Connect wallet
  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     await provider.send("eth_requestAccounts", []);
  //     const signer = await provider.getSigner();
  //     const account = await signer.getAddress();
  //     console.log("signer:" + signer);
  //     console.log("account:" + account);

  //     const balance = await provider.getBalance(account);
  //     console.log("balance:" + balance);

  //     const accounts = await ethereum.request({ method: "eth_accounts" });
  //     console.log("Accounts:" + accounts);

  //     const contract = new ethers.Contract(
  //       CONTRACT_ADDRESS,
  //       CONTRACT_ABI,
  //       signer
  //     );

  //     const signerAddress = await signer.getAddress();
  //     const value = await contract.balanceOf(signerAddress);
  //     console.log("Balance from contract: " + value.toString());

  //     setProvider(provider);
  //     setSigner(signer);
  //     setAccount(account);
  //     setContract(contract);

  //     const tokenName = await contract.name();
  //     const tokenSymbol = await contract.symbol();
  //     const totalSupply = await contract.totalSupply();

  //     setContractInfo({
  //       address: CONTRACT_ADDRESS,
  //       tokenName,
  //       tokenSymbol,
  //       totalSupply,
  //     });
  //   } else {
  //     alert("Please install MetaMask!");
  //   }
  // };

  const {
    account,
    chainId,
    provider,
    signer,
    contract,
    isConnected,
    accountInfo,
    networkInfo,
    contractInfo,
    balanceInfo,
    txs,
    connectWallet,
    disconnectWallet,
    getBalance,
    handleMyBalance,
    handleTransfer,
  } = useMetamask();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">My DApp</h1>
      {!isConnected ? (
        <button onClick={connectWallet}>Conectar</button>
      ) : (
        <div>
          <p>Conta: {account}</p>
          <p>Chain ID: {chainId}</p>
          <button onClick={disconnectWallet}>Desconectar</button>
        </div>
      )}
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          <div>
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Total supply</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>{contractInfo.tokenName}</th>
                  <td>{contractInfo.tokenSymbol}</td>
                  <td>{String(contractInfo.totalSupply)}</td>
                  <td>{contractInfo.deployedAt}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button onClick={getBalance}>Read Value</button>
          {/* <button onClick={setValue}>Set Value</button> */}
          <div className="p-4">
            <button
              onClick={handleMyBalance}
              className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            >
              Get my balance
            </button>
          </div>
          <div className="px-4">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>{balanceInfo.address}</th>
                    <td>{balanceInfo.balance}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
            <div className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Write to contract
              </h1>

              <form onSubmit={handleTransfer}>
                <div className="my-3">
                  <input
                    type="text"
                    name="recipient"
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="Recipient address"
                  />
                </div>
                <div className="my-3">
                  <input
                    type="text"
                    name="amount"
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="Amount to transfer"
                  />
                </div>
                <footer className="p-4">
                  <button
                    type="submit"
                    className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                  >
                    Transfer
                  </button>
                </footer>
              </form>
            </div>
          </div>
          <div>
            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
              <div className="mt-4 p-4">
                <h1 className="text-xl font-semibold text-gray-700 text-center">
                  Recent transactions
                </h1>
                <p>
                  <TxList txs={txs} />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
