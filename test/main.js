
const Rad = artifacts.require("Rad");
const assert = require('assert').strict;
const Test20 = artifacts.require("Test20");
const Test721 = artifacts.require("Test721");

contract('Rad Test', accounts => {


    // Starting users to use in test
    var users_test = 2


    // User Accounts
    var Alice = accounts[0]
    var Bob = accounts[1]
    var Mary = accounts[2]
    var Kiln = accounts[3]
    var Don = accounts[4]
    var Penny = accounts[5]
    var Cat = accounts[6]
    var Bjork = accounts[7]
    var Olga = accounts[8]
    var Treasury = accounts[9]
    var typeC = 'C'
    var typeP = 'P'


    // Accounts Array
    var acc_ray = [
        ['Alice', Alice],
        ['Bob', Bob],
        ['Mary', Mary],
        ['Kiln', Kiln],
        ['Don', Don],
        ['Penny', Penny],
        ['Cat', Cat],
        ['Bjork', Bjork],
        ['Olga', Olga],
        ['Treasury', Treasury]
    ]

    // Contract Parameters
    var strike = (12*10**18).toFixed() // Strike is 12 STK
    var underlying = (1*10**18).toFixed() // Underlying is 4 UDR
    var expiration = 1640836800 // dec 30 2021
    var decimals = (10**18)
    var gas = []
    var symbol = 'v0.0.1'
    var ratio = 5
    var hundred = (10**20).toFixed()
    var deposit = (10**19).toFixed()
    var close = (5*10**18).toFixed()
    var exercise = (5*10**18).toFixed()

    async function getGas(func, name) {
        /*
        @param func function to get gas from
        @param name string of function name
        */
        let spent = await func.receipt.gasUsed
        gas.push([name + ' gas: ', spent])
    }

    it('Migrates and initializes correctly', async () => {
        let _rad = await Rad.deployed()
        let _admin = await _rad.admin() 
        assert.strictEqual(_admin, Alice, 'Admin not equal')
    });

    it('Generate Reward Function Test', async () => {
        var totalSupply = (10**18).toString()
        let _rad = await Rad.deployed()
        let _token = await Test20.deployed()
        let _tokenAddress = _token.address
        let _admin = await _rad.admin()
        let _reward = "You're Rad!"
        let _post = await _rad.postReward(
            _tokenAddress, 
            "You're Rad!", 
            true, 
            false
            )
        let _rewardId = 0;


        let _claim = await _rad.claimReward(_rewardId);

        let _testBal = await _rad.testBalance();
        console.log('test balance: ', _testBal.toString())
        assert.strictEqual(_testBal.toString(), totalSupply, 'Supply should equal test balance');
    });

    it('Checks Reward Claimants', async () => {
        var totalSupply = (10**18).toString()
        let _rad = await Rad.deployed()
        let _token = await Test20.deployed()
        let _tokenAddress = _token.address
        let _admin = await _rad.admin()
        let _poster = Alice
        let _claimant = Alice
        let _reward = "You're Rad!"
        let _post = await _rad.postReward(
            _tokenAddress, 
            "You're Rad!", 
            true, 
            false
            )
        
        let _rewardId = await _rad.rewardId(_poster, _tokenAddress);
        let _claim = await _rad.claimReward(_rewardId);
        let _approve = _rad.approve(_claimant, _poster);
        let _isRewardClaimant = await _rad.isRewardClaimant(_claimant, _rewardId);
        
        console.log(_isRewardClaimant)
        assert.strictEqual(_isRewardClaimant, true, 'Should be reward claimant');
    });

    it('Post, Claim, Check ERC721 Reward', async () => {
        var totalSupply = (10**18).toString()
        let _rad = await Rad.deployed()
        let _token = await Test721.deployed()
        let _tokenAddress = _token.address
        let _admin = await _rad.admin()
        let _poster = Alice
        let _claimant = Alice
        let _reward = "You're Rad!"
        let _post = await _rad.postReward(
            _tokenAddress, 
            "You're Rad cause you have an NFT!", 
            false, 
            true
            )
        
        let _rewardId = await _rad.rewardId(_poster, _tokenAddress);
        let _claim = await _rad.claimReward(_rewardId);
        let _approve = _rad.approve(_claimant, _poster);
        let _isRewardClaimant = await _rad.isRewardClaimant(_claimant, _rewardId);
        
        console.log(_isRewardClaimant)
        assert.strictEqual(_isRewardClaimant, true, 'Should be reward claimant');
    });

})