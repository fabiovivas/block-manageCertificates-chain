module.exports = (app) => {
    app.route('/owner/alterPrice')
        .post(app.controllers.owner.alterPrice)

    app.route('/owner/collectEther/:account')
        .get(app.controllers.owner.collectEther)
}