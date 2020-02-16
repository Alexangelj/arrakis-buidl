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
import Create from './pages/Create';
import Claim from './pages/Claim';
import Home from './pages/Home';

// ABIs
import RadAbi from './abi/bin/Rad.abi';
import Test20 from './abi/bin/Test20.abi';

const WEB3_HOST = "http://localhost:7545";
const RAD_CONTRACT_ADDRESS = "0xC69d20c4a0787B9854C26DbAD270ECD6F4E3E55d";
const TEST20_CONTRACT_ADDRESS = "0x15392d4859E75e37ECf0B7BD19b1d148EE21E105";

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

    // rad
    const rad_abi = await this.getAbi(RadAbi);
    let rad_contract = await this.contract(rad_abi, RAD_CONTRACT_ADDRESS);

    // test20
    const test20_abi = await this.getAbi(Test20);
    let test20_contract = await this.contract(test20_abi, TEST20_CONTRACT_ADDRESS);

    let admin = await rad_contract.methods.admin().call();
    console.log(admin);

    this.setState({ defaultAccount, rad_contract, test20_contract });
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
                <Link to="/claim">Claim</Link>
              </li>
              <li>
                <Link to="/create">Create</Link>
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
            <Route path="/create">
              <Create state={this.state} />
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
