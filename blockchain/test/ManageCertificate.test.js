const ManageCertificate = artifacts.require('ManageCertificate')
const chai = require('./config/setupChai.js')
const assertFailure = require('./config/assertFailure')
const { toWei, BN } = require('web3-utils')
const expect = chai.expect;

contract('ManageCertificate Test', async accounts => {
    const [owner, school, student, externalAddress] = accounts
    let manageCertificate

    beforeEach(async () => {
        manageCertificate = await ManageCertificate.new({ from: owner })
        await manageCertificate.registerSchool({ from: school, value: toWei(new BN(1), "ether") })
    })

    it('User should be able to register yourself like a school', async () => {
        const isSchool = await manageCertificate.isSchool(school)
        return expect(isSchool).to.be.equal(true)
    })

    it('The value to register school should be equal or Bigger than priceInWei', async () => {
        return await assertFailure(manageCertificate.registerSchool({ from: externalAddress, value: toWei(new BN(1), "wei") }))
    })

    it('School should be able to register a student', async () => {
        await manageCertificate.registerStudent(student, { from: school })
        const isStudent = await manageCertificate.isStudent(student)
        return expect(isStudent).to.be.equal(true)
    })

    it('School can not register yourself like student', async () => {
        await assertFailure(manageCertificate.registerStudent(school, { from: school }))
        const isStudent = await manageCertificate.isStudent(student)
        return expect(isStudent).to.be.equal(false)
    })

    it('Only school should be able to register a student', async () => {
        await assertFailure(manageCertificate.registerStudent(student, { from: externalAddress }))
        const isStudent = await manageCertificate.isStudent(student)
        return expect(isStudent).to.be.equal(false)
    })

    it('School can not regiter a student with wrong address', async () => {
        const studentAddress = "0x0"
        return await assertFailure(manageCertificate.registerStudent(studentAddress, { from: school }))
    })

    it('School has access to student`s certificate after register and can access him certificate', async () => {
        const ipfsId = ""
        await manageCertificate.registerStudent(student, { from: school })
        await manageCertificate.emiteCertificate(student, ipfsId, { from: school })
        const certificates = await manageCertificate.getCertificates(student, school, { from: school })
        const isStudent = await manageCertificate.isStudent(student)
        expect(certificates.length).to.be.equal(1)
        return expect(isStudent).to.be.equal(true)
    })

    it('School can not emite certificate to a student with wrong address', async () => {
        const ipfsId = ""
        const studentAddress = "0x0"
        await manageCertificate.registerStudent(student, { from: school })
        return await assertFailure(manageCertificate.emiteCertificate(studentAddress, ipfsId, { from: school }))
    })

    it('School can not emite certificate to a student for other school', async () => {
        const ipfsId = ""
        await manageCertificate.registerSchool({ from: owner, value: toWei(new BN(1), "ether") })
        await manageCertificate.registerStudent(student, { from: school })
        return await assertFailure(manageCertificate.emiteCertificate(student, ipfsId, { from: owner }))
    })

    it('Only school should be able to emite certificate', async () => {
        const ipfsId = ""
        await manageCertificate.registerStudent(student, { from: school })
        return await assertFailure(manageCertificate.emiteCertificate(student, ipfsId, { from: owner }))
    })

    it('Student should be able to access yours certificates after register', async () => {
        const ipfsId = ""
        await manageCertificate.registerStudent(student, { from: school })
        await manageCertificate.emiteCertificate(student, ipfsId, { from: school })
        const certificates = await manageCertificate.getCertificates(student, school, { from: student })
        return expect(certificates.length).to.be.equal(1)
    })

    it('Student should be able to allow access for yours certificates', async () => {
        await manageCertificate.registerStudent(student, { from: school })
        await manageCertificate.allowExternalAccess(externalAddress, { from: student })
        const certificates = await manageCertificate.getCertificates(student, school, { from: externalAddress })
        return expect(certificates.length).to.be.equal(0)
    })

    it('Student can not allow access to wrong addres', async () => {
        const wrongAddres = "0x0"
        await manageCertificate.registerStudent(student, { from: school })
        return await assertFailure(manageCertificate.allowExternalAccess(wrongAddres, { from: student }))
    })

    it('Only student can allow access to certificates', async () => {
        return await assertFailure(manageCertificate.allowExternalAccess(externalAddress, { from: owner }))
    })

    it('Student should be able to remove external`s access for your certificate', async () => {
        await manageCertificate.registerStudent(student, { from: school })
        return expect(manageCertificate.removeAccess(externalAddress, { from: student })).to.be.fulfilled
    })

    it('Student can not remove access for wrong address for your certificate', async () => {
        const wrongAddress = ""
        await manageCertificate.registerStudent(student, { from: school })
        return await assertFailure(manageCertificate.removeAccess(wrongAddress, { from: student }))
    })

    it('Only Student can remove external`s access for your certificate', async () => {
        await manageCertificate.registerStudent(student, { from: school })
        return await assertFailure(manageCertificate.removeAccess(owner, { from: externalAddress }))
    })

    it('Student can not remove your access for your certificate', async () => {
        await manageCertificate.registerStudent(student, { from: school })
        return await assertFailure(manageCertificate.removeAccess(student, { from: student }))
    })

    it('Owner should be able to withdraw the contract`s balance', async () => {
        const balanceBefore = await web3.eth.getBalance(owner)
        await manageCertificate.collectEther({ from: owner })
        const balanceAfter = await web3.eth.getBalance(owner)
        return expect(new BN(balanceAfter)).to.be.bignumber.greaterThan(new BN(balanceBefore))
    })

    it('Only owner can withdraw the contract`s balance', async () => {
        return await assertFailure(manageCertificate.collectEther({ from: externalAddress }))
    })
})