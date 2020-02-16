import React, { Component } from 'react';
import { Button, FormControl, InputGroup, Row, Col } from 'react-bootstrap';

class Claim extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0
        }
        this.submit = this.submit.bind(this);
    }
    //function claimReward(uint256 _identification) public returns (bool success) {
    setId(id) {
        this.setState({ id });
    }
    async submit() {
        if (this.state.id === 0) {
            return;
        }
        let c = this.props.state.rad_contract;
        let claimResult = await c.methods.claimReward(this.state.id).send({
            from: this.props.state.defaultAccount,
            gas: 3000000
        });
        console.log(claimResult);
        this.setState({
            id: 0
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
                            onChange={(e) => this.setSource(e.target.value)}
                            value={this.state.id}
                        />
                    </InputGroup>
                    <Button onClick={this.submit}>Submit</Button>
                </Col>
            </Row>
            <div>
                <p>ID: {this.state.id}</p>
            </div>
        </div>;
    }
}

export default Claim;