var ManageCertificate = artifacts.require('ManageCertificate')

module.exports = async(deployer) => {
    await deployer.deploy(ManageCertificate)
}