

module.exports = (app) => {
    app.route('/file')
        .post(app.controllers.file.upload)

    app.route('/file/:hash')
        .get(app.controllers.file.read)
}