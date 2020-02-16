import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Web3 from 'web3';
import axios from 'axios';

// pages
import Admin from './pages/Admin';
import PostReward from './pages/PostReward';
import Claim from './pages/Claim';
import Home from './pages/Home';

// ABI
import RadAbi from './abi/bin/Rad.abi';

const WEB3_HOST = "http://localhost:7545";
const RAD_CONTRACT_ADDRESS = "0xcddCD6B40DFC4586Af32276Be946Da5fD4aa7F13";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultAccount: "",
      accounts: []
    };
    this.web3 = new Web3(WEB3_HOST);
  }
  async getDefaultAccount() {
    let accounts = await this.web3.eth.getAccounts();
    return accounts[0];
  }
  async getAllAccounts() {
    let accounts = await this.web3.eth.getAccounts();
    return accounts;
  }
  async contract(contract_abi, contract_address) {
    return new this.web3.eth.Contract(contract_abi, contract_address, {
      from: this.state.defaultAccount, // default from address
      gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    });
  }
  async componentDidMount() {
    const defaultAccount = await this.getDefaultAccount();

    // rad
    const rad_abi = await this.getAbi(RadAbi);
    let rad_contract = await this.contract(rad_abi, RAD_CONTRACT_ADDRESS);

    let admin = await rad_contract.methods.admin().call();
    console.log(admin);

    let accounts = this.getAllAccounts();

    this.setState({ defaultAccount, rad_contract, accounts });
  }
  async getAbi(file) {
    let response = await axios.get(file);
    return response.data;
  }
  render() {
    return (
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/claim">Claim Reward</Link>
              </li>
              <li>
                <Link to="/postreward">Post Reward</Link>
              </li>
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            </ul>
          </nav>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/claim">
              <Claim state={this.state} />
            </Route>
            <Route path="/postreward">
              <PostReward state={this.state} />
            </Route>
            <Route path="/admin">
              <Admin state={this.state} />
            </Route>
            <Route path="/">
              <Home state={this.state} />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
