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
    }
    async componentDidMount() {
        await this.setState({ rewards: await this.getRewards(await this.getNonce()) });
    }
    setId(id) {
        this.setState({ id });
    }
    async getRewards(nonce) {
        let c = this.props.state.rad_contract;
        if (c === undefined) {
            return [];
        }

        // get all rewards
        let rewards = [];
        for (let i = 0; i < nonce; i++) {
            rewards.push(await c.methods.rewardString(i).call());
        }
        return rewards;
    }
    async getNonce() {
        let c = this.props.state.rad_contract;
        if (c === undefined) {
            return 0;
        }
        let nonce = await c.methods.rewardNonce().call();
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
            <Row>
                <Col sm={6}>
                    <span>Claim Reward</span>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Reward ID"
                            aria-label="ID"
                            aria-describedby="basic-addon1"
                            onChange={(e) => this.setId(e.target.value)}
                            value={this.state.id == -1 ? null : this.state.id}
                        />
                    </InputGroup>
                    <Button onClick={this.submit}>Submit</Button>
                </Col>
                <Col sm={6}>
                    <span>Available Rewards</span>
                    <table>
                        <thead>
                            <tr>
                                <td><em>ID</em></td>
                                <td><em>Reward</em></td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.rewards !== [] ? this.state.rewards.map((val, idx, arr) => {
                                return <tr key={idx}>
                                    <td><code>{idx}</code></td>
                                    <td style={{ textAlign: "left" }}>{val}</td>
                                </tr>
                            }) : <></>}
                        </tbody>
                    </table>
                </Col>
            </Row>

        </div>;
    }
}

export default Claim;