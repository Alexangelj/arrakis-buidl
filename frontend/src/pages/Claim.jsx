import React, { Component } from 'react';
import { Button, FormControl, InputGroup, Row, Col } from 'react-bootstrap';

class Claim extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            rewards: []
        }
        this.submit = this.submit.bind(this);
        this.getRewards = this.getRewards.bind(this);
        this.getNonce = this.getNonce.bind(this);
    }
    async componentDidMount() {
        this.setState({ rewards: await this.getRewards() });
    }
    //function claimReward(uint256 _identification) public returns (bool success) {
    setId(id) {
        this.setState({ id });
    }
    async getRewards() {
        let c = this.props.state.rad_contract;
        if (c === undefined) {
            return [];
        }

        // approve myself to view my rewards
        c.methods.approve(this.props.state.defaultAccount, this.props.state.defaultAccount).send({
            from: this.props.state.defaultAccount,
            gas: 3000000
        });

        // get all my rewards (ids)
        let myRewardIds = [];
        let nonce = await this.getNonce();

        for (let i = 0; i < nonce; i++) {
            let result = await c.methods.isRewardClaimant(this.props.state.defaultAccount, i).call();
            if (result === true) {
                myRewardIds.push(i);
            }

        }
        console.log("my rewards", myRewardIds);

        // get rewards strings from my reward IDs
        let myRewards = [];
        for (let i = 0; i < myRewardIds.length; i++) {
            myRewards.push(await c.methods.rewardString(myRewardIds[i]).call());
        }
        console.log(myRewards);
        return myRewards;
    }
    async getNonce() {
        let c = this.props.state.rad_contract;
        if (c === undefined) {
            return 0;
        }
        let nonce = await c.methods.rewardNonce().call();
        console.log(nonce);
        return nonce;
    }
    async submit() {
        if (this.state.id === -1) {
            return;
        }
        console.log(this.state.id);
        let c = this.props.state.rad_contract;
        let claimResult = await c.methods.claimReward(this.state.id).send({
            from: this.props.state.defaultAccount,
            gas: 3000000
        });
        console.log(claimResult);
        this.setState({
            id: -1
        });
    }
    render() {
        return <div className="container">
            Claim
            <Row>
                <Col sm={6}>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="ID"
                            aria-label="ID"
                            aria-describedby="basic-addon1"
                            onChange={(e) => this.setId(e.target.value)}
                            value={this.state.id}
                        />
                    </InputGroup>
                    <Button onClick={this.submit}>Submit</Button>
                </Col>
                <Col sm={6}>
                    <table>
                        <tbody>
                            {this.state.rewards !== [] ? this.state.rewards.map((val, idx, arr) => {
                                return <tr key={idx}>
                                    <td>{val}</td>
                                </tr>
                            }) : <></>}
                        </tbody>
                    </table>
                </Col>
            </Row>
            <div>
                <p>ID: {this.state.id}</p>
            </div>
        </div>;
    }
}

export default Claim;