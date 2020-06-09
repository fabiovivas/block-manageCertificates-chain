module.exports = (app) => {
    app.route('/student/allowExternalAccess')
        .post(app.controllers.student.allowExternalAccess)

    app.route('/student/removeAccess')
        .post(app.controllers.student.removeAccess)
}