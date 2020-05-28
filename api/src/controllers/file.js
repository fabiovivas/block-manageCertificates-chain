const multer = require('multer')
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const http = require('http')


module.exports = (app) => {

    const storage = multer.memoryStorage()
    const uploadFile = multer({ storage: storage }).any()

    const upload = async (req, res) => {
        uploadFile(req, res, async (err) => {
            if (err)
                res.status(500).send(err)

            if (!req.files || req.files.length <= 0)
                res.status(500).send('erro')

            const cid = await app.services.file.upload(req.files[0].buffer)
            res.status(200).send(cid)
        })
    }

    const read = async (req, res) => {
        const file = await app.services.file.read(req.params.hash)

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=working-test.pdf',
            'Content-Length': file.length
        });
        res.end(file);

    }

    return { upload, read }
}
