module.exports = (app) => {
    const alterPrice = async (req, res) => {
        const { account, newPrice } = req.body
        try {
            const finalPrice = await app.services.owner.alterPrice(account, newPrice)
            return res.status(200).send(finalPrice) 
        } catch (error) {
            return res.status(500).send(error)
        }

    }

    const collectEther = async (req, res) => {
        const account = req.params.account
        try {
            const newBalance = await app.services.owner.collectEther(account)
            return res.status(200).send(newBalance)
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    return { alterPrice, collectEther }
}