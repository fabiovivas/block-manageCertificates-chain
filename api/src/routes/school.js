module.exports = (app) => {
    app.route('/school/emiteCertificate')
        .post(app.controllers.school.emiteCertificate)

    app.route('/school/registerStudent')
        .post(app.controllers.school.registerStudent)
}