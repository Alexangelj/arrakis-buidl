import React, { Component } from 'react';
import { Button, FormControl, InputGroup, Row, Col } from 'react-bootstrap';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            source: "",
            reward: "",
            erc: "",
            rewards: []
        }
        this.submit = this.submit.bind(this);
        this.getRewards = this.getRewards.bind(this);
        this.getNonce = this.getNonce.bind(this);
        console.log("master state", this.props.state);
    }
    async componentDidMount() {
        await this.setState({ rewards: await this.getRewards(await this.getNonce()) });
    }
    setSource(source) {
        this.setState({ source });
    }
    setReward(reward) {
        this.setState({ reward });
    }
    setErc(erc) {
        this.setState({ erc });
    }
    async getRewards(nonce) {
        let c = this.props.state.rad_contract;
        if (c === undefined) {
            return [];
        }
        let rewards = [];
        for (let i = 0; i < nonce; i++) {
            rewards.push(await c.methods.rewardString(i).call());
        }
        console.log(rewards);
        return rewards;
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
        let c = this.props.state.rad_contract;
        let isErc20 = this.state.erc === "erc20";
        let postResult = await c.methods.postReward(this.state.source, this.state.reward, isErc20, !isErc20).send({
            from: this.props.state.defaultAccount,
            gas: 3000000
        });
        console.log(postResult);
        let rewards = await this.getRewards(await this.getNonce());
        this.setState({
            source: "",
            reward: "",
            erc: "",
            rewards
        });
    }
    render() {
        console.log(this.state.rewards);
        return <div className="container">
            Create
            <Row>
                <Col sm={6}>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Source Address"
                            aria-label="Source Address"
                            aria-describedby="basic-addon1"
                            onChange={(e) => this.setSource(e.target.value)}
                            value={this.state.source}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Reward Text"
                            aria-label="Reward Text"
                            aria-describedby="basic-addon1"
                            onChange={(e) => this.setReward(e.target.value)}
                            value={this.state.reward}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Radio name="erc" aria-label="Erc20" onClick={() => this.setErc("erc20")} checked={this.state.erc === "erc20"} />
                        ERC20
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Radio name="erc" aria-label="NFT" onClick={() => this.setErc("erc721")} checked={this.state.erc === "erc721"} />
                        NFT
                    </InputGroup>
                    <Button onClick={this.submit}>Submit</Button>
                </Col>
                <Col sm={6}>
                    <table>
                        <tbody>
                            {this.state.rewards !== [] ? this.state.rewards.map((val, idx, arr) => {
                                return <tr key={idx}>
                                    <td>{idx}</td>
                                    <td>{val}</td>
                                </tr>
                            }) : <></>}
                        </tbody>
                    </table>
                </Col>
            </Row>
            <div>
                <p>Source: <code>{this.state.source}</code></p>
                <p>Reward: <code>{this.state.reward}</code></p>
                <p>Type: <code>{this.state.erc}</code></p>
            </div>
        </div>;
    }
}

export default Create;