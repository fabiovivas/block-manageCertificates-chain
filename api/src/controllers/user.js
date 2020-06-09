module.exports = (app) => {
    const registerSchool = async (req, res) => {
        const account = req.body.account
        try {
            const result = await app.services.user.registerSchool(account)
            res.status(200).send(result)
        } catch (error) {
            console.log(error); 
            return res.status(500).send(error)
        }

    }

    const getCertificates = async (req, res) => {
        const { account, studentAccount, schoolAccount } = req.params
        console.log('req.body', req.body)
        try {
            const result = await app.services.user.getCertificates(account, [studentAccount, schoolAccount])
            return res.status(200).send(result)
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    return { registerSchool, getCertificates }
}