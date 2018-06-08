'use strict'

const { expect } = require('chai')
const logic = require('.')
const shApi = require('api')

describe('logic (sweet-home)', () => {
    const userData = { name: 'Nur', surname: 'C', phone: '637986245', dni: '42765289I', password: '123' }

    beforeEach(done => {
        const { dni, password } = userData

        shApi.authenticateUser(dni, password)
            .then(id => {
                return shApi.unregisterUser(id, dni, password)
            })
            .then(res => {
                done()
            })
            .catch(err => {
                done()
            })
    })

    describe('register', () => {
        it('should succeed on correct data', () => {
            const { name, surname, phone, dni, password } = userData

            return logic.registerUser(name, surname, phone, dni, password)
                .then(res => expect(res).to.be.true)
        })
    })

    describe('login', () => {
        it('should succeed on correct data', () => {
            const { name, surname, phone, dni, password } = userData

            return shApi.registerUser(name, surname, phone, dni, password)
                .then(() => logic.authenticateUser(dni, password))
                .then(res => {
                    expect(res).to.exist

                    expect(logic.userId).not.to.equal('NO-ID')
                })
        })
    })
    describe('retrieve', () => {
        it('shoul succeed on correct data', () => {
            const { name, surname, phone, dni, password } = userData

            return shApi.registerUser(name, surname, phone, dni, password)
                .then(() => logic.authenticateUser(dni, password))
                .then(() => {
                    logic.retrieveUser(logic.userId)
                        .then(res => {
                            expect(res).to.be.true

                            expect(logic.data).not.to.equal('NO-DATA')
                        })
                })

        })
    })
    
    false && describe('update', () => {
        it('should succeed on correct data', () => {
            const { name, surname, phone, dni, password } = userData

            return shApi.registerUser(name, surname, phone, dni, password)
                .then(() => logic.authenticateUser(dni, password))
                .then(() => {
                    const newPhone = '123'
                    const newPassword = '789'

                    return logic.updateUser(logic.userId, name, surname, phone, dni, password, newPassword)
                        .then(res => {
                            expect(res).to.be.true

                        })
                })
        })

    })

    describe('list users', () => {
        it('shoul succeed on correct data', () => {

            return shApi.listUsers()
                .then(() => logic.authenticateUser(dni, password))
                .then(() => {
                    logic.listUsers()
                        .then(res => {
                            expect(res).to.be.true

                            expect(logic.data).not.to.equal('NO-DATA')
                        })
                })

        })
    })
    describe('unregister', () => {
        it('should succeed on correct data', () => {
            const { name, surname, phone, dni, password } = userData

            return shApi.registerUser(name, surname, phone, dni, password)
                .then(() => logic.authenticateUser(dni, password))
                .then(() => {
                    logic.unregisterUser(logic.userId, dni, password)
                        .then(res => {
                            expect(res).to.be.true

                        })
                })
        })

    })
})
