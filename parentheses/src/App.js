import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [acc, setAcc] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
  }, []);

  useEffect(() => {
    provider && loadContract();
  }, [provider]);

  const loadProv = async () => {
    if (provider) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setAcc(address);

      return signer;
    } else {
      console.error("Metamask is not installed/invalid");
    }
  };

  const loadContract = async () => {
    const signer = await loadProv();
    let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const contract = new ethers.Contract(contractAddress, Upload.abi, signer);

    setContract(contract);
    setProvider(provider);
  };

  const handleShareClick = () => {
    setModalOpen(true);
  };

  return (
    <div className="App">
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}

      <div className="app-container">
        <h1>DropChain</h1>

        <p>
          Account : <u>{acc ? acc : "Not connected"}</u>
        </p>
        <FileUpload
          account={acc}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={acc}></Display>
      </div>
    </div>
  );
}

export default App;
