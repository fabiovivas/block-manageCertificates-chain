
module.exports = (app) => {

    const registerStudent = async (account, studentAccount) => {

        await app.services.web3Manage.method('registerStudent', account, [studentAccount])
            .catch(error => { error })

        const registered = await app.services.web3Manage.method('isStudent', account, [studentAccount])
            .catch(error => { console.log(error); throw error })

        return registered
    }

    const emiteCertificate = async (content, account, studentAccount) => {
        let emited = false
        const cid = await app.services.certificate.write(content)
        await app.services.web3Manage.method('emiteCertificate', account, [studentAccount, cid])
            .then(result => emited = true)
            .catch(error => { throw error })
        return { cid, emited }
    }

    return { registerStudent, emiteCertificate }
}