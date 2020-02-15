/*
Title: Reputation and Achievement DApp, 'RAD'
Description: 'Achievement' creators can generate achievements for users to earn
             by interacting with whitelisted smart contracts.

Authors: Brock Smedley and Alexander Angel
.*/


pragma solidity ^0.6.0;

abstract contract RadInterface {

    /// @notice `msg.sender` Generates a reward 'reward' to grant address 'source'.
    /// @param _source The address of the achievement owner
    /// @param _reward A string 
    /// @return success Whether the approval was successful or not
    function generateReward(address _source, string memory _reward) public virtual returns (bool success);
}

contract Rad is RadInterface {
    /*
    Events:
        Create Reward, Claimed Reward, Expire Reward claim period, Approve reward view
    Public functions:

    Functions:
        generate reward: address smartcontract, 

    */

    event NewReward(address indexed _creator, address indexed _source, string _metadata);
    event ClaimReward(address indexed _owner, address indexed _source);
    event ExpireReward(address indexed _creator, address indexed _source);
    event Approve(address indexed _approver, address indexed _approved);

    address public admin;
    string public reward;

    mapping (address => string) public claimants;

    constructor() public {
        admin = msg.sender;
    }


    function generateReward(address _source, string memory _reward) public override returns (bool success) {
        require(msg.sender == admin, 'Not the owner of source contract'); // placeholder for checking owner of source contract
        reward = _reward;
        claimants[_source] = _reward;
        return true;
    }
}