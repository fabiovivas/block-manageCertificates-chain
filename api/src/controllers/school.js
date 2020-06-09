const multer = require('multer')

module.exports = (app) => {

    const storage = multer.memoryStorage()
    const uploadFile = multer({ storage: storage }).any()

    const registerStudent = async (req, res) => {
        const { account, studentAccount } = req.body
        try {
            const registered = await app.services.school.registerStudent(account, studentAccount)
            return res.status(200).send(registered)
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    const emiteCertificate = async (req, res) => {

        uploadFile(req, res, async (err) => {
            const { account, studentAccount } = req.body

            if (err)
                return res.status(500).send(err)

            if (!req.files || req.files.length <= 0)
                return res.status(500).send('Files does not upload')

            const result = await app.services.school.emiteCertificate(req.files[0].buffer, account, studentAccount)

            if (!result.emited)
                return res.status(500).send('File does not registered')

            res.status(200).send(result.cid)
        })
    }

    return { registerStudent, emiteCertificate }
}
