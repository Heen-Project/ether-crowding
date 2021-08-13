const path = require('path')
const solc = require('solc')
const fs = require('fs-extra')

const buildPath = path.resolve(__dirname, 'build')
fs.removeSync(buildPath)

const contractFile = 'Campaign.sol'
const campaignPath = path.resolve(__dirname, 'contracts', contractFile)
const source = fs.readFileSync(campaignPath, 'utf8')

const input = {
    language: 'Solidity',
    sources: {},
    settings: {
        metadata: {
            useLiteralContent: true
        },
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
}

input.sources[contractFile] = {
    content: source
}

const output = JSON.parse(solc.compile(JSON.stringify(input)))
const contracts = output.contracts[contractFile]

fs.ensureDirSync(buildPath)

for (let contract in contracts) {
    if (contracts.hasOwnProperty(contract)) {
        fs.outputJsonSync(path.resolve(buildPath, `${contract}.json`), contracts[contract])
    }
}