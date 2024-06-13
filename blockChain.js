const Block = require("./block")
const cryptoHash = require("./crypto-hash")

class BlockChain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        })
        this.chain.push(newBlock)
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false
        }

        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, data } = chain[i]
            const actualLastHash = chain[i - 1].hash
            const validateHash = cryptoHash(timestamp, lastHash, data)

            if (lastHash !== actualLastHash) return false
            if (hash !== validateHash) return false
        }
        return true
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.log('the incoming chain must be longer')
            return;
        }
        if (!BlockChain.isValidChain(chain)) {
            console.log('the incoming chain must be valid')
            return;
        }
        console.log('replacing the chain with ', chain)
        this.chain = chain
    }
}
module.exports = BlockChain