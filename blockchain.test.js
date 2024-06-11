const BlockChain = require('./blockChain')
const Block = require('./block')

describe('Blockchain', () => {
    let blockChain;
    beforeEach(() => {
        blockChain = new BlockChain()
    })

    it('contains the `chain` array instance', () => {
        expect(blockChain.chain instanceof Array).toBe(true)
    })

    it('starts with a genesis block', () => {
        expect(blockChain.chain[0]).toEqual(Block.genesis())
    })

    it('adds a new block to the chain', () => {
        const newData = 'demoData'
        blockChain.addBlock({ data: newData })

        expect(blockChain.chain[blockChain.chain.length - 1].data).toEqual(newData)
    })


    describe("isValidChain()", () => {
        describe("when the chain doesn't starting with genesis block", () => {
            it("returns false", () => {
                blockChain.chain[0] = { data: "fake genesis" }

                expect(BlockChain.isValidChain(blockChain.chain)).toBe(false)
            })
        })
    })

    describe("when the chain starts with genesis block and has multiple blocks", () => {
        beforeEach(() => {
            blockChain.addBlock({ data: "data-1" })
            blockChain.addBlock({ data: "data-2" })
            blockChain.addBlock({ data: "data-3" })
        })

        describe("and a lastHash reference is changed", () => {
            it("returns false", () => {
                blockChain.chain[2].lastHash = "modHash"

                expect(BlockChain.isValidChain(blockChain.chain)).toBe(false)
            })
        })

        describe("and the chain contains a block with an invalid field", () => {
            it("returns false", () => {
                blockChain.chain[2].data = "modData"

                expect(BlockChain.isValidChain(blockChain.chain)).toBe(false)
            })
        })

        describe("and the chain doesn't contain any invalid blocks", () => {
            it("returns true", () => {

                expect(BlockChain.isValidChain(blockChain.chain)).toBe(true)
            })
        })
    })
}) 
