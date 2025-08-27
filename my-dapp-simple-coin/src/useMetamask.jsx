import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";

export function useMetamask() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [txs, setTxs] = useState([]);
  const [contractListened, setContractListened] = useState();
  const [error, setError] = useState();
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-",
  });

  const [accountInfo, setAccountInfo] = useState({
    address: "-",
    signer: "-",
    provider: "-",
    contract: "-",
  });

  const [networkInfo, setNetworkInfo] = useState({
    network: "-",
    networkId: "-",
    chainId: "-",
    chainName: "-",
    nativeCurrency: "-",
  });

  const [tokenInfo, setTokenInfo] = useState({
    name: "-",
    symbol: "-",
    decimals: "-",
    totalSupply: "-",
  });

  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-",
  });

  // Efeitos: listeners do MetaMask
  useEffect(() => {
    if (!window.ethereum) return;

    if (contractInfo.address !== "-") {
      console.log("contractInfo.address:" + contractInfo.address);
      contract.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        console.log(
          "event.transactionHash:" +
            event.transactionHash +
            "event.blockNumber:" +
            event.blockNumber +
            "event.blockHash:" +
            event.blockHash +
            " and event.transactionIndex:" +
            event.transactionIndex
        );

        const timestamp = Date.now(); // This would be the timestamp you want to format
        const transactionText = String(timestamp + from + to + amount);
        console.log("transactionText:" + transactionText);
        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: transactionText, //event.transactionHash, //event.blockHash and event.transactionIndex
            from,
            to,
            amount: String(amount),
          },
        ]);
      });
      setContractListened(contract);

      return () => {
        contractListened.removeAllListeners();
      };
    }

    const handleAccountsChanged = (accounts) => {
      console.log("accountsChanged:", accounts);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        disconnect();
      }
    };

    const handleChainChanged = (chainIdHex) => {
      console.log("chainChanged:", chainIdHex);
      setChainId(parseInt(chainIdHex, 16));
    };

    const handleConnect = (info) => {
      console.log("connect:", info);
      setChainId(parseInt(info.chainId, 16));
    };

    const handleDisconnect = (error) => {
      console.log("disconnect:", error);
      disconnectWallet();
    };

    const handleMessage = (message) => {
      console.log("message:", message);
    };

    // Registrar listeners
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("connect", handleConnect);
    window.ethereum.on("disconnect", handleDisconnect);
    window.ethereum.on("message", handleMessage);

    // Cleanup
    return () => {
      if (!window.ethereum.removeListener) return;
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("connect", handleConnect);
      window.ethereum.removeListener("disconnect", handleDisconnect);
      window.ethereum.removeListener("message", handleMessage);
    };
  }, [contractInfo.address]);

  // Conectar carteira
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        const network = await provider.getNetwork();

        // Criar contrato já com signer (permite leitura e escrita)
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );

        setContractListened(contract);

        console.log("signer:" + signer);
        console.log("account:" + account);

        const balance = await provider.getBalance(account);
        console.log("balance:" + balance);

        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log("Accounts:" + accounts);

        const signerAddress = await signer.getAddress();
        const value = await contract.balanceOf(signerAddress);
        console.log("Balance from contract: " + value.toString());

        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setAccount(account);
        setChainId(network.chainId);
        setIsConnected(true);

        setAccountInfo({
          address: account,
          signer: signer,
          provider: provider,
          contract: contract,
        });

        setNetworkInfo({
          network: network,
          networkId: network.networkId,
          chainId: network.chainId,
          chainName: network.name,
          nativeCurrency: network.nativeCurrency,
        });

        const tokenName = await contract.name();
        const tokenSymbol = await contract.symbol();
        const totalSupply = await contract.totalSupply();
        setContractInfo({
          address: CONTRACT_ADDRESS,
          tokenName,
          tokenSymbol,
          totalSupply,
        });
      } catch (err) {
        console.error("Erro ao conectar:", err);
      }
    } else {
      alert("MetaMask não encontrada!");
    }
  };

  // "Desconectar" (limpa estado local)
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    setAccountInfo({
      address: "-",
      signer: "-",
      provider: "-",
      contract: "-",
    });
    setNetworkInfo({
      network: "-",
      networkId: "-",
      chainId: "-",
      chainName: "-",
      nativeCurrency: "-",
    });
    setContractInfo({
      address: "-",
      tokenName: "-",
      tokenSymbol: "-",
      totalSupply: "-",
    });
  };

  // Example: call a contract read function
  const getBalance = async () => {
    if (!contract) return;

    // const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const value = await contract.balanceOf(signerAddress);

    // const value = await contract.myPublicVariable(); // replace with your function
    alert("Value from contract: " + value.toString());
  };

  const handleMyBalance = async (e) => {
    e.preventDefault();

    if (!contract) return;
    const signerAddress = await signer.getAddress();
    const balance = await contract.balanceOf(signerAddress);

    setBalanceInfo({
      address: signerAddress,
      balance: String(balance),
    });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    if (!contract) return;
    const tx = await contract.transfer(
      data.get("recipient"),
      data.get("amount")
    );
    const txHash = tx.hash;

    alert("Transaction confirmed!");
  };

  return {
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
  };
}
