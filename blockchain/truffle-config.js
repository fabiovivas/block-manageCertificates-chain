require('dotenv').config({ path: './.env' })

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777" // Match any network id
    },
    ganache_local: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEUMONIC, 'http://127.0.0.1:7545')
      },
      network_id: "5777"
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEUMONIC, 'https://ropsten.infura.io/v3/1a3ed7b30f754f4099e92a9d8086b8b1')
      },
      network_id: "3"
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.8"
    }
  }
}
