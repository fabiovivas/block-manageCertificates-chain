require('dotenv').config({ path: './src/.env' })
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider');
const provider = new HDWalletProvider(process.env.MNEUMONIC, 'http://127.0.0.1:7545')
const web3Manage = new Web3(provider)

module.exports = () => {

    this.contractAddress = "0x31e66e7a17aDd20a89d54eD30aa67De7F168C018"
    this.abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "studentId", "type": "address" }, { "indexed": false, "internalType": "address", "name": "schoolId", "type": "address" }, { "indexed": false, "internalType": "string", "name": "ipfsId", "type": "string" }], "name": "CertificateEmited", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "schoolId", "type": "address" }], "name": "schoolRegistered", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "studentId", "type": "address" }, { "indexed": false, "internalType": "address", "name": "schoolId", "type": "address" }], "name": "studentRegistered", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "certificateAccess", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isSchool", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isStudent", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "priceInWei", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "alterPrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "collectEther", "outputs": [], "stateMutability": "payable", "type": "function", "payable": true }, { "inputs": [], "name": "registerSchool", "outputs": [], "stateMutability": "payable", "type": "function", "payable": true }, { "inputs": [{ "internalType": "address", "name": "studentId", "type": "address" }], "name": "registerStudent", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "studentId", "type": "address" }, { "internalType": "string", "name": "ipfsIdDocument", "type": "string" }], "name": "emiteCertificate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }], "name": "allowExternalAccess", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }], "name": "removeAccess", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "studentId", "type": "address" }, { "internalType": "address", "name": "schoolId", "type": "address" }], "name": "getCertificates", "outputs": [{ "components": [{ "internalType": "address", "name": "studentId", "type": "address" }, { "internalType": "address", "name": "schoolId", "type": "address" }, { "internalType": "string", "name": "ipfsId", "type": "string" }], "internalType": "struct ManageCertificate.Certificate[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function", "constant": true }]

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

    this.methods = () => {
        let callMethods = []
        let sendMethods = []
        for (const item of this.abi) {
            if (item.type == 'constructor' || item.type == 'event') continue
            if (item.stateMutability == 'view')
                callMethods.push(item.name)
            else
                sendMethods.push(item.name)
        }
        return { callMethods, sendMethods }
    }

    this.callMethod = async (methodName, account, params) => {
        let returnValue
        const contract = await this.contract()
        account = (await this.accounts()).filter(acc => acc == account)[0]
        returnValue = await contract['methods'][`${methodName}`](...params)
            .call({ from: account })
            .catch(error => { throw error })
        return returnValue
    }

    this.sendMethod = async (methodName, account, params) => {
        let returnValue
        const contract = await this.contract()
        account = (await this.accounts()).filter(acc => acc == account)[0]

        returnValue = await contract['methods'][`${methodName}`](...params)
            .send({ from: account })
            .catch(error => { console.log('error', error); throw error })
        return returnValue
    }

    this.sendMethodWithValue = async (methodName, account, params, value) => {
        let returnValue
        const contract = await this.contract()
        account = (await this.accounts()).filter(acc => acc == account)[0]
        value = await web3Manage.utils.fromWei(value, 'wei')
        returnValue = await contract['methods'][`${methodName}`](...params)
            .send({ from: account, value })
            .catch(error => { console.log('error', error); throw error })
        return returnValue
    }

    const method = async (methodName, account, params, value = undefined) => {
        const methods = this.methods()
        const isCallMethod = methods.callMethods.filter(item => item == methodName)
        const isSendMethod = methods.sendMethods.filter(item => item == methodName)

        if (!isCallMethod[0] && !isSendMethod[0]) return undefined

        const accounts = await this.accounts()
        account = accounts.filter(acc => acc === account)
        if (!account[0]) return undefined

        if (value)
            return await this.sendMethodWithValue(methodName, account, params, value)

        if (isCallMethod[0])
            return await this.callMethod(methodName, account, params)
        else
            return await this.sendMethod(methodName, account, params)
    }

    const getBalance = async (account) => {
        const balance = await web3Manage.eth.getBalance(account)
        return await web3Manage.utils.fromWei(balance, 'ether')
    }

    const convertToWei = async (value) => {
        value = new web3Manage.utils.BN(value)
        return await web3Manage.utils.toWei(value, 'ether')
    }

    return { method, getBalance, convertToWei }
}