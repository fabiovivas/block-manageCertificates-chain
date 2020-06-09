module.exports = (app) => {
    const registerSchool = async (account) => {
        const oneEther = await app.services.web3Manage.convertToWei(1)
        await app.services.web3Manage.method('registerSchool', account, [], oneEther)
            .catch(error => { throw error })

        const registered = await app.services.web3Manage.method('isSchool', account, [account])
            .catch(error => { console.log(error); throw error })

        return registered
    }

    const getCertificates = async (account, params) => {
        const certificates = await app.services.web3Manage.method('getCertificates', account, params)
            .catch(error => {console.log(error); throw error })

        return certificates
    }

    return { registerSchool, getCertificates }
}