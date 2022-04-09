import React, { useState } from "react";
import { ethers } from "ethers";
import SimpleStore_abi from "./SimpleStore_abi.json";
import "./App.css";

const SimpleStore = () => {
  const constactAdress = "0x08F8646B528C3Ec83Af4f41EAFf2c1dE19e85990";
  const [ErrorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState("xxxxxxxxxxxxxxx");
  const [connButtonText, setconnButtonText] = useState("Connect wallet");

  const [currentContraVal, setCurrentContraVal] = useState('none');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [Contract, setContract] = useState(null);
  const [isHide, setIsHide] = useState(true);

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          if (result[0])
          {
            accountChangeHandler(result[0]);
            setconnButtonText("wallet connected");
          }
        });
    } else {
      setErrorMessage("Need to install Metamask");
    }
  };

  const accountChangeHandler =  (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);
    let tempContract = new ethers.Contract(
      constactAdress,
      SimpleStore_abi,
      tempSigner
    );
    setContract(tempContract);
  };

  const getCurrentVal = async () => {
    let val = await Contract.get();
    setCurrentContraVal(val);
    setIsHide(false);
  };

  const setHandler = (event) => {
    event.preventDefault();
    Contract.set(event.target.setText.value);
  };
  return (
    <div className="wrapper">
        <h1>{"Contract Interaction"}</h1>
        <div className="form">
        <button onClick={connectWalletHandler}> {connButtonText}</button>
        <p><span>Address:</span> {defaultAccount}</p>
        </div>
        <div className="form">
        <form onSubmit={setHandler}>
              <input id="setText" type="text" placeholder="update my contrat"></input>
              <p className="UpdateButton">
                <button type={"submit"}>Update</button>
              </p>
        </form>
        </div>
        <div className="form">
        <button onClick={getCurrentVal} className="button">get current update</button>
            <br/>
            <p className={`ResultUpdate ${isHide && 'hide-block'}`}>{currentContraVal}</p>
            {ErrorMessage}
          </div>
    </div>
  );
};

export default SimpleStore;
