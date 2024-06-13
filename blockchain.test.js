const BlockChain = require('./blockChain')
const Block = require('./block')

describe('Blockchain', () => {
    let blockChain, newChain, originalChain;
    beforeEach(() => {
        blockChain = new BlockChain()
        newChain = new BlockChain()

        originalChain = blockChain.chain;
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

    describe("replaceChain()", () => {
        let errorMock, logMock;
        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock
            global.console.log = logMock
        })
        describe("when the new chain is not longer", () => {
            it("doesn't replace the chain", () => {
                newChain.chain[0] = { new: "chain" }
                blockChain.replaceChain(newChain.chain)
                expect(blockChain.chain).toEqual(originalChain)
            })
        })

        describe("when the new chain is longer", () => {
            beforeEach(() => {
                newChain.addBlock({ data: "data-1" })
                newChain.addBlock({ data: "data-2" })
                newChain.addBlock({ data: "data-3" })
            })
            describe("and the chain is invalid", () => {
                it("doesn't replace the chain", () => {
                    newChain.chain[2].hash = "modHash"
                    blockChain.replaceChain(newChain.chain)
                    expect(blockChain.chain).toEqual(originalChain)
                })
            })

            describe("and the chain is valid", () => {
                it("replaces the chain", () => {
                    blockChain.replaceChain(newChain.chain)
                    expect(blockChain.chain).toEqual(newChain.chain)
                })
            })
        })
    })

}) 
