require('dotenv').config({ path: './src/.env' })
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider');
const provider = new HDWalletProvider(process.env.MNEUMONIC, 'https://ropsten.infura.io/v3/1a3ed7b30f754f4099e92a9d8086b8b1')
const web3Manage = new Web3(provider)

module.exports = () => {

    this.contractAddress = "0x4bB92D8Ecb5691d9F8a26c1C5bF3b2664A57FB75"
    this.abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"studentId","type":"address"},{"indexed":false,"internalType":"address","name":"schoolId","type":"address"},{"indexed":false,"internalType":"string","name":"ipfsId","type":"string"}],"name":"CertificateEmited","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"schoolId","type":"address"}],"name":"schoolRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"studentId","type":"address"},{"indexed":false,"internalType":"address","name":"schoolId","type":"address"}],"name":"studentRegistered","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"certificateAccess","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isSchool","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isStudent","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"priceInWei","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"alterPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"collectEther","outputs":[],"stateMutability":"payable","type":"function","payable":true},{"inputs":[],"name":"registerSchool","outputs":[],"stateMutability":"payable","type":"function","payable":true},{"inputs":[{"internalType":"address","name":"studentId","type":"address"}],"name":"registerStudent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"studentId","type":"address"},{"internalType":"string","name":"ipfsIdDocument","type":"string"}],"name":"emiteCertificate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"allowExternalAccess","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"removeAccess","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"studentId","type":"address"},{"internalType":"address","name":"schoolId","type":"address"}],"name":"getCertificates","outputs":[{"components":[{"internalType":"address","name":"studentId","type":"address"},{"internalType":"address","name":"schoolId","type":"address"},{"internalType":"string","name":"ipfsId","type":"string"}],"internalType":"struct ManageCertificate.Certificate[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function","constant":true}]

    this.accounts = async () => {
        let accounts = []
        await web3Manage.eth.getAccounts((err, accs) => {
            if (err != null)
                return "Error to get yours accounts"

            if (accs.length == 0) {
                return "Any accounts found"
            }
            accounts = accs
        })
        return accounts
    }

    this.contract = async () => {
        const contract = await new web3Manage.eth.Contract(this.abi, this.contractAddress)
        return contract
    }

    const hasSchoolAccess = async (account) => {
        let isSchool = false
        const accounts = await this.accounts()
        const contract = await this.contract()

        account = accounts.filter(acc => acc === account)
        if (!account[0]) return isSchool

        await contract['methods']['isSchool'](account[0])
            .call({ from: account[0] })
            .then(result => isSchool = result)
            .catch(error => console.log(error))

        return isSchool
    }

    const emiteCertificate = async (account, studentAccount, cid) => {
        let emited = false
        const accounts = await this.accounts()
        const contract = await this.contract()

        account = accounts.filter(acc => acc === account)
        if (!account[0]) return { error: "whithout permission" }

        await contract['methods']['emiteCertificate'](studentAccount, cid)
            .send({ from: account[0] })
            .then(result => emited = true)
            .catch(error => console.log(error))

        return emited
    }

    return { hasSchoolAccess, emiteCertificate }
}