
const Test = artifacts.require("Test");

contract('Test Test', accounts => {


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
        let _test = await Test.deployed()
        console.log(((await _test.balanceOf(Alice))/decimals).toString())
    });

})