const ManageCertificate = artifacts.require('ManageCertificate')

const chai = require('./setupchai.js')
let assertFailure = require('./assertFailure')
const { toWei, BN } = require('web3-utils')
const expect = chai.expect;

contract('ManageCertificate Test', async accounts => {
    const [owner, school, student] = accounts

    let manageCertificate
    beforeEach(async () => {
        manageCertificate = await ManageCertificate.new({ from: owner })
    })

    it('The value to register school should be equal or Bigger than priceInWei', async () => {
        const smallerOneEther = toWei(new BN(1), "wei")
        const biggerOneEther = toWei(new BN(2), "ether")

        await assertFailure(manageCertificate.registerSchool({ from: school, value: smallerOneEther }))
        await manageCertificate.registerSchool({ from: school, value: biggerOneEther })
        const isSchool = await manageCertificate.isSchool(school)
        return expect(isSchool).to.be.equal(true)
    })

    it('school should be able to register a student', async () => {
        const biggerOneEther = toWei(new BN(2), "ether")
        await manageCertificate.registerSchool({ from: school, value: biggerOneEther })
        await manageCertificate.registerStudent(student, { from: school })
        const isStudent = await manageCertificate.isStudent(student)
        return expect(isStudent).to.be.equal(true)
    })

})