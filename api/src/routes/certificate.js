module.exports = (app) => {
    app.route('/certificate/:hash')
        .get(app.controllers.certificate.read)
}