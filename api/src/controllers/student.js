module.exports = (app) => {
    const allowExternalAccess = async (req, res) => {
        const { account, externalAccount } = req.body
        try {
            const hasAccess = await app.services.student.allowExternalAccess(account, externalAccount)
            return res.status(200).send(hasAccess)
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    const removeAccess = async (req, res) => {
        const { account, externalAccount } = req.body
        try {
            const hasAccess = await app.services.student.removeAccess(account, externalAccount)
            return res.status(200).send(hasAccess)
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    return { allowExternalAccess, removeAccess }
}