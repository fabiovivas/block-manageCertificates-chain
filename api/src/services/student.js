module.exports = (app) => {
    const allowExternalAccess = async (account, externalAccount) => {
        await app.services.web3Manage.method('allowExternalAccess', account, [externalAccount])
            .catch(error => { throw error })

        return this.hasAccess(account, externalAccount)
            .catch(error => { throw error })
    }

    const removeAccess = async (account, externalAccount) => {
        await app.services.web3Manage.method('removeAccess', account, [externalAccount])
            .catch(error => { throw error })

        return this.hasAccess(account, externalAccount)
            .catch(error => { throw error })
    }

    this.hasAccess = async (account, externalAccount) => {
        return await app.services.web3Manage.method('certificateAccess', account, [account, externalAccount])
            .catch(error => { throw error })
    }

    return { allowExternalAccess, removeAccess }
}