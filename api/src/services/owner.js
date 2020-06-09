module.exports = (app) => {
    const alterPrice = async (account, newPrice) => {
        const value = await app.services.web3Manage.convertToWei(newPrice)
        
        await app.services.web3Manage.method('alterPrice', account, [value])
            .catch(error => { throw error })

        const result = await app.services.web3Manage.method('priceInWei', account, [])
            .catch(error => { throw error })

        return result
    }

    const collectEther = async (account) => {
        await app.services.web3Manage.method('collectEther', account, [])
            .catch(error => { throw error })
        return await app.services.web3Manage.getBalance(account)
            .catch(error => { throw error })
    }

    return { alterPrice, collectEther }
}