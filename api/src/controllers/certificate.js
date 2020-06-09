module.exports = (app) => {
    const read = async (req, res) => {
        const file = await app.services.certificate.read(req.params.hash)        
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=response.pdf',
            'Content-Length': file.length
        });
        return res.end(file);
    }

    return { read }
}