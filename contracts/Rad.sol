/*
Title: RAD: Reputation and Achievement DAPP
Description: Posters can create, 'post', Microbounties which are then claimed by Claimants.
             The microbounty rewards used in this demo are strings which are mapped to the claimant's address.
             Posters have analytics to see how many users have claimed a microbounty.
             We call them microbounties because the criteria is easy to meet (micro), 
             and they drive user engagement which is beneficial to the poster (bounty).

Authors: Brock Smedley and Alexander Angel
.*/


pragma solidity ^0.6.0;


abstract contract RadInterface {
    /** 
     * @notice `msg.sender` Posts a bounty reward 'reward' which is linked to a contract address.
     * @param _source The contract address which the bounty is linked to.
     * @param _reward The bounty reward - just a string. Could be a hash, or a private key to a wallet.
     * @param _erc20 A bool to check if _source has an erc20 standard interface.
     * @param _erc721 A bool to check _source has an erc721 standard interface.
     * @return id The unique identifier of the posted bounty.
     */
    function postReward(address _source, string memory _reward, bool _erc20, bool _erc721) public virtual returns (uint256 id);

    /** 
     * @dev `msg.sender` Claims a bounty reward ('_identification).
     * @param _identification The bounty nonce when it was posted.
     * @return success If the transaction was successful or reverted.
     */
    function claimReward(uint256 _identification) public virtual returns (bool success);
}


abstract contract Erc20Token {
    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address _owner) virtual external returns(uint256);
}

abstract contract Erc721Token {
    /**
     * @dev Returns the name metadata of the token.
     */
    function name() virtual external returns(string memory);
}


/**
 * @dev Main contract which handles posting bounties, 
 * claiming bounties, and storing mappings of 
 * claims, address, and source addresses.
 */
contract Rad is RadInterface {

    /**
     * @dev Emitted when a bounty with a higher nonce is posted
     * by a source contract owner ('_creator') 
     * that is linked to a ('_source') contract address.
     */
    event PostReward(address indexed _creator, address indexed _source, string _metadata);
    
    
    /**
     * @dev Emitted when the ownership of a bounty ('_identification')
     *  linked to ('_source') is given to a claimant ('_claimant').
     */
    event ClaimReward(address indexed _claimant, address indexed _source, uint256 _identification);
    
    /**
     * @dev Emitted when a claimant ('_approver') grants permission to
     * an approved party ('_approved') to view the claimant's claims.
     */
    event Approve(address indexed _approver, address indexed _approved);


    address public admin;

    string public reward;
    uint256 public rewardNonce;

    uint256 private erc20Id;
    uint256 private erc721Id;

    uint256 private balanceThreshold;
    uint256 public testBalance;

    string private expectedName;
    string public actualName;


    // Maps Posters and Source contracts to an ID
    mapping (address => mapping(address => uint256)) public rewardId; // Address of poster -> address of source contract -> ID of reward
    
    // Maps IDs to Source Addresses
    mapping (uint256 => address) public rewardSourceAddress;

    // Maps IDs to Reward String
    mapping (uint256 => string) public rewardString;

    // Maps IDs to NFT Name metadata
    mapping (uint256 => string) public nftName;

    // Maps erc20 and erc721 standard checks to an ID
    mapping (uint256 => mapping (uint256 => bool)) public interfaceType;

    // Maps Claimant Address to IDs of Rewards and returns True if claimed
    mapping (address => mapping(uint256 => bool)) private _catalogue;

    // Maps Poster Addresses to IDs of Rewards and returns True if posted
    mapping (address => mapping(uint256 => bool)) private _posters;

    // Maps Addresses of claimants to addresses of users who can view their rewards
    mapping (address => mapping(address => bool)) private _allowances;

    // Maps a nonce value for the amount of times a reward is claimed
    mapping (uint256 => uint256) public _timesClaimed;

    // Maps a nonce value for the amount of rewards an address has claimed
    mapping (address => uint256) public _totalClaims;


    /**
     * @dev Sets the values for `admin`, `rewardNonce`, an 'Id' for the 
     * erc20 and erc721 checks, as well as a balance threshold for
     * erc20 checks.
     * These values are immutable: they can only be set once during
     * construction.
     */
    constructor() public {
        admin = msg.sender;
        rewardNonce = 0;
        erc20Id = 1;
        erc721Id = 2;
        balanceThreshold = 10**17;
    }


    /**
     * @dev Utility function that compares strings ('a') and ('b')
     * and returns whether they have equality or not.
     */
    function hashCompareWithLengthCheck(string memory a, string memory b) internal pure returns (bool) {
        if(bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return (keccak256(abi.encodePacked(a))) == (keccak256(abi.encodePacked(b)));
        }
    }

    /**
     * @dev Updates the stats of posted and claimed bounties.
     */
    function updateAnalytics(address _owner, uint256 _identification) internal returns (bool) {
        _timesClaimed[_identification] += 1;
        _totalClaims[_owner] += 1;
        return true;
    }

    /** 
     * @dev `msg.sender` Posts a bounty reward 'reward' which is linked to a contract address.
     * @param _source The contract address which the bounty is linked to.
     * @param _reward The bounty reward - just a string. Could be a hash, or a private key to a wallet.
     * @param _erc20 A bool to check if _source has an erc20 standard interface.
     * @param _erc721 A bool to check _source has an erc721 standard interface.
     * @return id The unique identifier of the posted bounty.
     */
    function postReward(address _source, string memory _reward, bool _erc20, bool _erc721) public override returns (uint256 id) {
        require(msg.sender == admin, 'Not the owner of source contract'); // placeholder for checking owner of source contract
        require(_erc20 || _erc721, 'Cannot be both erc20 and erc721');
        
        rewardString[rewardNonce] = _reward;
        rewardId[msg.sender][_source] = rewardNonce;
        rewardSourceAddress[rewardNonce] = _source;

        interfaceType[rewardNonce][erc20Id] = _erc20;
        interfaceType[rewardNonce][erc721Id] = _erc721;
        
        if (_erc721) {
            Erc721Token erc721 = Erc721Token(_source);
            expectedName = erc721.name();
            nftName[rewardNonce] = expectedName;
        }
        rewardNonce += 1;
        return rewardNonce - 1;
    }

    /** 
     * @dev `msg.sender` Claims a bounty reward ('_identification).
     * @param _identification The bounty nonce when it was posted.
     * @return success If the transaction was successful or reverted.
     */
    function claimReward(uint256 _identification) public override returns (bool success) {
        if (interfaceType[_identification][erc20Id]) {
            Erc20Token erc20 = Erc20Token(rewardSourceAddress[_identification]);
            testBalance = erc20.balanceOf(msg.sender);
            if (testBalance > balanceThreshold){
                _catalogue[msg.sender][_identification] = true;
                _timesClaimed[_identification] += 1;
                _totalClaims[msg.sender] += 1;
                return true;
            }
            return false;
        }

        if (interfaceType[_identification][erc721Id]) {
            Erc721Token erc721 = Erc721Token(rewardSourceAddress[_identification]);
            actualName = erc721.name();
            if (hashCompareWithLengthCheck(actualName, expectedName)) {
                _catalogue[msg.sender][_identification] = true;
                _timesClaimed[_identification] += 1;
                _totalClaims[msg.sender] += 1;
                return true;
            }
            return true;
        }
        return false;
    }

    /**
     * @dev A claimant ('_approver') grants permission to
     * an approved party ('_approved') to view the claimant's claims.
     * @param _claimant Address of record owner.
     * @param _viewer Address of record viewer.
     * @return If the function call is successful or reverted.
     */
    function approve(address _claimant, address _viewer) public returns (bool) {
        _allowances[_claimant][_viewer] = true;
        return true;
    }
    
    /**
     * @dev A public function to see if a claimant owns a bounty reward.
     * @param _claimant Address of record owner.
     * @param _identification Nonce of bounty when posted.
     * @return If the claimant has claimed the bounty ('_identification').
     */
    function isRewardClaimant(address _claimant, uint256 _identification) public view returns (bool) {
        require(_allowances[_claimant][msg.sender], 'Msg.Sender does not have view permission');
        return _catalogue[_claimant][_identification];
    }

    /**
     * @dev A public function to see if an address is the poster of a bounty.
     * @param _poster Address of bounty poster.
     * @param _identification Nonce of bounty when posted.
     * @return If the address has posted the bounty ('_identification').
     */
    function isRewardPoster(address _poster, uint256 _identification) public view returns (bool) {
        return _posters[_poster][_identification];
    }
}