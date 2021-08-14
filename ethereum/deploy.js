const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compiledFactory = require('./build/CampaignFactory.json')

const mnemonic_phrase = process.env.NEXT_PUBLIC_ACCOUNT_MNEMONIC
const rinkeby_network = process.env.NEXT_PUBLIC_RINKEBY_ENDPOINT

const provider = new HDWalletProvider({
    mnemonic: {
      phrase: mnemonic_phrase
    },
    providerOrUrl: rinkeby_network
})

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()
    console.log(`Attempting to deploy from account ${accounts[0]}`)

    const address = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: '0x' + compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0] })

    console.log(`Contract deployed to ${address.options.address}`)
    provider.engine.stop()
}

deploy()