import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import logo from '../bufficorn.png';
import green_ribbon from '../green-ribbon-512.png';
import orange_ribbon from '../orange-ribbon-512.png';

function RewardComponent(reward) {
    return <Row key={reward.id} style={{ padding: 12, width: 720 }}>
        <Col sm={5}>
            <div className="imgContainer">
                <img style={{ width: 64 }} src={reward.nftName === "" ? green_ribbon : orange_ribbon} />
                <div className="centeredText">{reward.id}</div>
            </div>
        </Col>
        <Col sm={7}>
            <div style={{ textAlign: "left" }}>
                <span>{reward.reward}</span>
                <span>{reward.nftName !== "" ? ` (NFT: ${reward.nftName})` : ""}</span>
            </div>
        </Col>

    </Row>;
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rewards: []
        }
        this.getNonce = this.getNonce.bind(this);
        this.getRewards = this.getRewards.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    async componentDidMount() {
        this.setState({ rewards: await this.getRewards() });
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
        let nftNames = [];
        for (let i = 0; i < myRewardIds.length; i++) {
            myRewards.push(await c.methods.rewardString(myRewardIds[i]).call());
            nftNames.push(await c.methods.nftName(myRewardIds[i]).call());
        }
        console.log(myRewards);
        let identifiedRewards = [];
        myRewards.map((val, idx, arr) => {
            let r = {
                "reward": val,
                "id": myRewardIds[idx],
                "nftName": nftNames[idx]
            };
            console.log("reward", r);
            identifiedRewards.push(r);
            return;
        });
        return identifiedRewards;
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
    render() {
        return <header className="App-header">
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <code>My Rewards</code>
            {this.state.rewards !== [] ? this.state.rewards.map((val, idx, arr) => {
                return RewardComponent(val);
            }) : <></>}
        </header>;
    }
}

export default Home;