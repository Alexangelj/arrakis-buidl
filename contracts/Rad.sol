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
    /// @return id The id of the posted reward
    function postReward(address _source, string memory _reward, bool _erc20, bool _erc721) public virtual returns (uint256 id);

}

abstract contract Erc20Token {
    function balanceOf(address _owner) virtual external returns(uint256);
}

abstract contract Erc721Token {
    function name() virtual external returns(string memory);
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
    string public expectedName;


    mapping (address => string) public rewards;
    mapping (address => mapping(address => uint256)) public rewardId; // Address of poster -> address of source contract -> ID of reward
    mapping (uint256 => mapping (uint256 => bool)) public interfaceType;
    mapping (uint256 => address) public rewardAddress;

    mapping (address => mapping(uint256 => bool)) private _catalogue;
    mapping (address => mapping(uint256 => bool)) private _posters;

    mapping (address => mapping(address => bool)) private _allowances;

    constructor() public {
        admin = msg.sender;
        rewardNonce = 0;
        erc20Id = 1;
        erc721Id = 2;
        balThreshold = 10**17;
    }


    function postReward(address _source, string memory _reward, bool _erc20, bool _erc721) public override returns (uint256 id) {
        require(msg.sender == admin, 'Not the owner of source contract'); // placeholder for checking owner of source contract
        require(_erc20 || _erc721, 'Cannot be both erc20 and erc721');
        
        reward = _reward;
        rewards[_source] = _reward;
        rewardId[msg.sender][_source] = rewardNonce;
        rewardAddress[rewardNonce] = _source;

        interfaceType[rewardNonce][erc20Id] = _erc20;
        interfaceType[rewardNonce][erc721Id] = _erc721;
        
        rewardNonce += 1;
        return rewardNonce -= 1;
    }

    function claimReward(uint256 _identification) public returns (bool success) {
        if (interfaceType[_identification][erc20Id]) {
            Erc20Token erc20 = Erc20Token(rewardAddress[_identification]);
            testBalance = erc20.balanceOf(msg.sender);
            if (testBalance > balThreshold){
                _catalogue[msg.sender][_identification] = true;
                return true;
            }
            return false;
        }

        if (interfaceType[_identification][erc721Id]) {
            Erc721Token erc721 = Erc721Token(rewardAddress[_identifier]);
            testName = erc721.name();
            if (testName == expectedName) {
                _catalogue[msg.sender][_identification] = true;
                return true;
            }
            return true;
        }
        
        return false;
    }

    function approve(address _claimant, address _viewer) public returns (bool) {
        _allowances[_claimant][_viewer] = true;
        return true;
    }
    
    function isRewardClaimant(address _claimant, uint256 _identification) public view returns (bool) {
        require(_allowances[_claimant][msg.sender], 'Msg.Sender does not have view permission');
        return _catalogue[_claimant][_identification];
    }

    function isRewardPoster(address _poster, uint256 _identification) public view returns (bool) {
        return _posters[_poster][_identification];
    }
}