import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Chart } from 'react-charts'

const MyChart = (props) => {
    console.log(props.thedata);
    let layoutdata = props.thedata.map((val, idx, arr) => {
        return [val.id, parseInt(val.claims)];
    });
    console.log(layoutdata);
    const data = React.useMemo(
        () => [
            {
                label: 'Popular Rewards',
                // data: [[0, 1], [1, 2], [2, 4], [3, 2]]
                data: layoutdata
            },

        ],
        [layoutdata]
        // []
    );
    const series = React.useMemo(
        () => ({
            type: 'bar'
        }),
        []
    )

    const axes = React.useMemo(
        () => [
            { primary: true, type: 'linear', position: 'bottom' },
            { type: 'linear', position: 'left' }
        ],
        []
    );

    const lineChart = (
        // A react-chart hyper-responsively and continuusly fills the available
        // space of its parent element automatically
        <div
            style={{
                width: '500px',
                height: '300px'
            }}
        >
            <Chart data={data} series={series} axes={axes} tooltip />
        </div>
    );

    return lineChart;
}

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            claims: [],
            actives: [],
            us_claims: []
        };
        this.getNonce = this.getNonce.bind(this);
    }
    // returns ordered list of most claimed rewards
    async getSortedClaimedRewards() {
        let claims = await this.getUnsortedClaimedRewards();
        claims.sort((a, b) =>
            a.claims <= b.claims ? 1 : -1
        );
        return claims;
    }
    async getUnsortedClaimedRewards() {
        let c = this.props.state.rad_contract;
        if (c === undefined) {
            return [];
        }
        let nonce = await this.getNonce();
        let claims = [];
        for (let i = 0; i < nonce; i++) {
            let numClaims = await c.methods._timesClaimed(i).call();
            let reward = await c.methods.rewardString(i).call();
            let item = {
                "id": i,
                "claims": numClaims,
                "reward": reward
            };
            claims.push(item);
        }
        claims.push({
            "id": -0.1,
            claims: 0
        });
        return claims;
    }
    async getSortedMostActiveUsers() {
        let c = this.props.state.rad_contract;
        if (c === undefined) {
            return [];
        }
        let accounts = await this.props.state.accounts;
        let claims = [];
        console.log("accounts", accounts);
        for (let i = 0; i < accounts.length; i++) {
            let res = await c.methods._totalClaims(accounts[i]).call();
            console.log("res", res);
            let item = {
                "address": accounts[i],
                "claims": res
            };
            claims.push(item);
        }
        claims.sort((a, b) =>
            a.claims <= b.claims ? 1 : -1
        );
        return claims;
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
    async componentDidMount() {
        let claims = await this.getSortedClaimedRewards();
        let actives = await this.getSortedMostActiveUsers();
        let us_claims = await this.getUnsortedClaimedRewards();
        this.setState({ claims, actives, us_claims });
    }
    render() {
        return <Row>
            <Col sm={6}>
                <div>
                    Most Claimed Rewards
                    <table style={{ marginLeft: 40 }}>
                        <thead>
                            <tr>
                                <td><em>id</em></td>
                                <td><em>claims</em></td>
                                <td><em>MicroBounty Reward</em></td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.claims.map((val, idx, arr) => {
                                    return idx < arr.length - 1 ? <tr key={idx}>
                                        <td>{val.id}</td>
                                        <td>{val.claims}</td>
                                        <td style={{ textAlign: "left", paddingLeft: 24 }}>{val.reward}</td>
                                    </tr> : null;
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div>
                    Most Active Users
                    <table style={{ marginLeft: 40 }}>
                        <thead>
                            <tr>
                                <td><em>address</em></td>
                                <td><em>claims</em></td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.actives.map((val, idx, arr) => {
                                    return <tr key={idx}>
                                        <td>{val.address}</td>
                                        <td>{val.claims}</td>
                                    </tr>;
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </Col>
            <Col sm={6}>
                <MyChart thedata={this.state.us_claims} />
            </Col>
        </Row>;
    }
}

export default Admin;