const multer = require('multer')

module.exports = (app) => {

    const storage = multer.memoryStorage()
    const uploadFile = multer({ storage: storage }).any()

    const emiteCertificate = async (req, res) => {
        uploadFile(req, res, async (err) => {
            const { account, studentAccount } = req.body
            const isSchool = await app.services.web3Manage.hasSchoolAccess(account)

            if (!isSchool)
                return res.status(403).send('Only school has access to this service')

            if (err)
                return res.status(500).send(err)

            if (!req.files || req.files.length <= 0)
                return res.status(500).send('Files does not upload')

            const cid = await app.services.file.upload(req.files[0].buffer)
            const emited = await app.services.web3Manage.emiteCertificate(account, studentAccount, cid)

            if (!emited)
                return res.status(500).send('File does not registered')

            res.status(200).send(cid)
        })
    }

    const read = async (req, res) => {
        const file = await app.services.file.read(req.params.hash)

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=response.pdf',
            'Content-Length': file.length
        });
        res.end(file);

    }

    return { emiteCertificate, read }
}
