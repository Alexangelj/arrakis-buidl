import React, { Component } from 'react';
import logo from './bufficorn.png';
import './App.css';
import Web3 from 'web3';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultAccount: ""
    };
    this.web3 = new Web3("http://localhost:7545");
  }
  async getDefaultAccount() {
    let accounts = await this.web3.eth.getAccounts();
    return accounts[0];
  }
  async componentDidMount() {
    const defaultAccount = await this.getDefaultAccount();
    this.setState({ defaultAccount });
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
