import React, { Component } from 'react';
import logo from './bufficorn.png';
import './App.css';
import Web3 from 'web3';
import RadAbi from './abi/bin/Rad.abi';
import axios from 'axios';

const WEB3_HOST = "http://localhost:7545";
const RAD_CONTRACT_ADDRESS = "0x07948942045B27c795462AE594179c8297E8Ea43";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultAccount: ""
    };
    this.web3 = new Web3(WEB3_HOST);
  }
  async getDefaultAccount() {
    let accounts = await this.web3.eth.getAccounts();
    return accounts[0];
  }
  async contract(contract_abi, contract_address) {
    return new this.web3.eth.Contract(contract_abi, contract_address, {
      from: this.state.defaultAccount, // default from address
      gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    });
  }
  async componentDidMount() {
    const defaultAccount = await this.getDefaultAccount();
    const rad_abi = await this.getAbi(RadAbi);
    let rad_contract = await this.contract(rad_abi, RAD_CONTRACT_ADDRESS);
    let admin = await rad_contract.methods.admin().call();
    console.log(admin);
    this.setState({ defaultAccount, rad_contract });
  }
  async getAbi(file) {
    let response = await axios.get(file);
    return response.data;
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          Default Account: <code>{this.state.defaultAccount}</code>
        </header>
      </div>
    );
  }
}

export default App;
