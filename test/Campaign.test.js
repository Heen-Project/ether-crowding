const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts, factory, campaignAddress, campaign

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: '0x' + compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '2000000' })
  
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '2000000' 
    })
  
    campaignAddress = await factory.methods.getDeployedCampaigns().call()
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress[0])
})

describe('Campaigns', () => {
    it('deploys the factory and a campaign', () => {
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('marks caller as the campaign creator', async () => {
        const creator = await campaign.methods.creator().call()
        assert.strictEqual(creator, accounts[0])
    })

    it('pledge some money and list them as backers', async () => {
        await campaign.methods.makePledge().send({
            value: '200',
            from: accounts[1]
        })
        const isBackers = await campaign.methods.backers(accounts[1]).call()
        assert(isBackers)
    })

    it('pledge money requires a minimum amount', async () => {
        try {
            await campaign.methods.makePledge().send({
                value: '50',
                from: accounts[1]
            })
            assert(false)
        } catch (error) {
            assert(error)
        }
    })

    it('creator able to make a payment request', async () => {
        await campaign.methods.makePledge().send({
            value: '200',
            from: accounts[1]
        })

        await campaign.methods.makePaymentRequest('Buy supplies', '100', accounts[0]).send({
            from: accounts[0],
            gas: '2000000'
        })

        const request = await campaign.methods.paymentRequests(0).call()
        assert('Buy supplies', request.description)
    })

    it('complete payment request process', async () => {
        await campaign.methods.makePledge().send({
            value: web3.utils.toWei('10', 'ether'),
            from: accounts[1]
        })

        await campaign.methods.makePaymentRequest('Need money to kickstart the project', web3.utils.toWei('7', 'ether'), accounts[2])
            .send({
                from: accounts[0],
                gas: '2000000'
            })

        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '2000000'
        })

        await campaign.methods.settleRequest(0).send({
            from: accounts[0],
            gas: '2000000'
        })

        let balance = await web3.eth.getBalance(accounts[2])
        balance = parseFloat(web3.utils.fromWei(balance, 'ether'))
        assert(balance >= 107)
    })
})