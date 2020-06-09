const ipfsClient = require('ipfs-http-client')
const toBuffer = require('it-to-buffer')
const all = require('it-all')
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001')

module.exports = () => {
    const read = async (hash) => {
        const file = await toBuffer(ipfs.cat(`${hash}`))
        return file
    }

    const write = async (content) => {
        const result = await all(ipfs.add(content))
        return result[0].cid.toString()
    }

    return { read, write }
}