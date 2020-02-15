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
    /// @param _erc20 A bool to check for erc20 interface
    /// @param _erc721 A bool to check for erc721 interface
    /// @return success Whether the post was successful or not
    function postReward(address _source, string memory _reward, bool _erc20, bool _erc721) public virtual returns (bool success);

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
    uint256 public rewardNonce;
    uint256 private erc20Id;
    uint256 private erc721Id;
    uint256 private typeId;

    mapping (address => string) public rewards;
    mapping (uint256 => string) public rewardId;
    mapping (uint256 => mapping (uint256 => bool)) public interfaceType;

    constructor() public {
        admin = msg.sender;
        rewardNonce = 0;
        erc20Id = 1;
        erc721Id = 2;
    }


    function postReward(address _source, string memory _reward, bool _erc20, bool _erc721) public override returns (bool success) {
        require(msg.sender == admin, 'Not the owner of source contract'); // placeholder for checking owner of source contract
        require(_erc20 || _erc721, 'Cannot be both erc20 and erc721');
        
        reward = _reward;
        rewards[_source] = _reward;
        rewardId[rewardNonce] = reward;

        interfaceType[rewardNonce][erc20Id] = _erc20;
        interfaceType[rewardNonce][erc721Id] = _erc721;
        
        rewardNonce += 1;
        return true;
    }

    function claimReward(uint256 _identification) public view returns (bool success) {
        require(msg.sender == admin, 'Not the owner of source contract'); // placeholder for checking owner of source contract
        
        if (interfaceType[_identification][erc20Id]) {
            return true;
        }

        if (interfaceType[_identification][erc721Id]) {
            return true;
        }
        
        return true;
    }
    
}