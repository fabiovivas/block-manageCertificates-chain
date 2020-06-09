module.exports = (app) => {
    app.route('/user/registerSchool')
        .post(app.controllers.user.registerSchool)

    app.route('/user/getCertificates/account/:account/studentAccount/:studentAccount/schoolAccount/:schoolAccount')
        .get(app.controllers.user.getCertificates)
}