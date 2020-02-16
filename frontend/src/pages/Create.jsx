import React, { Component } from 'react';
import { Button, FormControl, InputGroup, Row, Col } from 'react-bootstrap';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            source: "",
            reward: "",
            erc: ""
        }
        this.submit = this.submit.bind(this);
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
    async submit() {
        let c = this.props.state.rad_contract;
        let isErc20 = this.state.erc === "erc20";
        let postResult = await c.methods.postReward(this.state.source, this.state.reward, isErc20, !isErc20).send({
            from: this.props.state.defaultAccount,
            gas: 3000000
        });
        console.log(postResult);
        this.setState({
            source: "",
            reward: "",
            erc: ""
        });
    }
    render() {
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
                        <InputGroup.Radio name="erc" aria-label="Erc721" onClick={() => this.setErc("erc721")} checked={this.state.erc === "erc721"} />
                        ERC721
                    </InputGroup>
                    <Button onClick={this.submit}>Submit</Button>
                </Col>
            </Row>
            <div>
                <p>Source: {this.state.source}</p>
                <p>Reward: {this.state.reward}</p>
                <p>Type: {this.state.erc}</p>
            </div>
        </div>;
    }
}

export default Create;