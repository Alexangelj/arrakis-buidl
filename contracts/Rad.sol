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

abstract contract Token {
    function balanceOf(address _owner) virtual external returns(uint256);
}


contract Rad is RadInterface {
    /*
    Events:
        Create Reward, Claimed Reward, Expire Reward claim period, Approve reward view
    Public functions:

    Functions:
        generate reward: address smartcontract, 

    */

    event PostReward(address indexed _creator, address indexed _source, string _metadata);
    event ClaimReward(address indexed _owner, address indexed _source);
    event ExpireReward(address indexed _creator, address indexed _source);
    event Approve(address indexed _approver, address indexed _approved);

    address public admin;
    string public reward;
    uint256 public rewardNonce;
    uint256 private erc20Id;
    uint256 private erc721Id;
    uint256 private typeId;

    uint256 private balThreshold;

    uint256 public testBalance;


    mapping (address => string) public rewards;
    mapping (uint256 => string) public rewardId;
    mapping (uint256 => mapping (uint256 => bool)) public interfaceType;
    mapping (uint256 => address) public rewardAddress;
    mapping (address => mapping(uint256 => bool)) public catalogue;
    mapping (address => mapping(uint256 => bool)) public posters;

    constructor() public {
        admin = msg.sender;
        rewardNonce = 0;
        erc20Id = 1;
        erc721Id = 2;
        balThreshold = 10**18;
    }


    function postReward(address _source, string memory _reward, bool _erc20, bool _erc721) public override returns (bool success) {
        require(msg.sender == admin, 'Not the owner of source contract'); // placeholder for checking owner of source contract
        require(_erc20 || _erc721, 'Cannot be both erc20 and erc721');
        
        reward = _reward;
        rewards[_source] = _reward;
        rewardId[rewardNonce] = reward;
        rewardAddress[rewardNonce] = _source;

        interfaceType[rewardNonce][erc20Id] = _erc20;
        interfaceType[rewardNonce][erc721Id] = _erc721;
        
        rewardNonce += 1;
        return true;
    }

    function claimReward(uint256 _identification) public returns (bool success) {
        if (interfaceType[_identification][erc20Id]) {
            Token erc20 = Token(rewardAddress[_identification]);
            testBalance = erc20.balanceOf(msg.sender);
            if (testBalance > balThreshold){
                catalogue[msg.sender][_identification] = true;
                return true;
            }
            return false;
        }

        if (interfaceType[_identification][erc721Id]) {
            return true;
        }
        
        return false;
    }
    
    function isRewardClaimant(address _address, uint256 _identification) public view returns (bool) {
        return catalogue[_address][_identification];
    }

    function isRewardPoster(address _owner, uint256 _identification) public view returns (bool) {
        return posters[_owner][_identification];
    }
}