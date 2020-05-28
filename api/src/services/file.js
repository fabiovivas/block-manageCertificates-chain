const ipfsClient = require('ipfs-http-client');
const all = require('it-all')
const toBuffer = require('it-to-buffer')
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001')

module.exports = () => {
    const upload = async (content) => {
        const result = await all(ipfs.add(content))
        return result[0].cid.toString()
    }

    const read = async (hash) => {
        const file = await toBuffer(ipfs.cat(`${hash}`))
        return file
    }

    return { upload, read }
}