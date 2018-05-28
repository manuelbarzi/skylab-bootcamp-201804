'use strict'

const mongoose = require('mongoose')
const { expect } = require('chai')
const logic = require('.')
const { User, Note } = require('../models')

describe('logic (notes)', () => {
    const userData = { name: 'John', surname: 'Doe', email: 'jd@mail.com', password: '123' }
    const dummyUserId = '123456781234567812345678'
    const dummyNoteId = '123456781234567812345678'
    const noteText = 'my note'
    const indexes = []

    before(() => mongoose.connect('mongodb://localhost/skylab-bootcamp-201804-test'))

    beforeEach(() => {
        let count = 10 + Math.floor(Math.random() * 10)
        indexes.length = 0
        while (count--) indexes.push(count)

        return Promise.all([User.remove()/*, Note.deleteMany()*/])
    })

    describe('register user', () => {
        it('should succeed on correct dada', () =>
            logic.registerUser('John', 'Doe', 'jd@mail.com', '123')
                .then(res => expect(res).to.be.true)
        )

        // TODO error cases
    })

    describe('authenticate user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(() =>
                    logic.authenticateUser('jd@mail.com', '123')
                        .then(id => expect(id).to.exist)
                )
        )

        // TODO error cases
    })

    describe('retrieve user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.retrieveUser(id)
                })
                .then(user => {
                    expect(user).to.exist

                    const { name, surname, email, _id, password, notes } = user

                    expect(name).to.equal('John')
                    expect(surname).to.equal('Doe')
                    expect(email).to.equal('jd@mail.com')

                    expect(_id).to.be.undefined
                    expect(password).to.be.undefined
                    expect(notes).to.be.undefined
                })
        )

        // TODO error cases
    })

    describe('udpate user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.updateUser(id, 'Jack', 'Wayne', 'jd@mail.com', '123', 'jw@mail.com', '456')
                        .then(res => {
                            expect(res).to.be.true

                            return User.findById(id)
                        })
                        .then(user => {
                            expect(user).to.exist

                            const { name, surname, email, password } = user

                            expect(user.id).to.equal(id)
                            expect(name).to.equal('Jack')
                            expect(surname).to.equal('Wayne')
                            expect(email).to.equal('jw@mail.com')
                            expect(password).to.equal('456')
                        })
                })
        )

        // TODO error cases
    })

    describe('unregister user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.unregisterUser(id, 'jd@mail.com', '123')
                        .then(res => {
                            expect(res).to.be.true

                            return User.findById(id)
                        })
                        .then(user => {
                            expect(user).to.be.null
                        })
                })
        )

        // TODO error cases
    })


    describe('add note', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.addNote(id, noteText)
                        .then(noteId => {
                            // expect(typeof noteId).to.equal('string')
                            // or
                            expect(noteId).to.be.a('string')
                            expect(noteId).to.exist

                            return User.findById(id)
                                .then(user => {
                                    expect(user).to.exist

                                    expect(user.notes).to.exist
                                    expect(user.notes.length).to.equal(1)

                                    const [{ id, text }] = user.notes

                                    expect(id).to.equal(noteId)
                                    expect(text).to.equal(noteText)
                                })
                        })
                })
        )

        it('should fail on wrong user id', () => {
            return logic.addNote(dummyUserId, noteText)
                .catch(({ message }) => expect(message).to.equal(`no user found with id ${dummyUserId}`))
        })

        it('should fail on no user id', () =>
            logic.addNote()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.addNote('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.addNote('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no text', () => {
            logic.addNote(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('text is not a string'))
        })

        it('should fail on empty text', () =>
            logic.addNote(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('text is empty or blank'))
        )

        it('should fail on blank text', () =>
            logic.addNote(dummyUserId, '   ')
                .catch(({ message }) => expect(message).to.equal('text is empty or blank'))
        )
    })

    describe('retrieve note', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)
            const note = new Note({ text: noteText })

            user.notes.push(note)

            return user.save()
                .then(({ id: userId, notes: [{ id: noteId }] }) => {
                    return logic.retrieveNote(userId, noteId)
                })
                .then(({ id, text }) => {
                    expect(id).to.equal(note.id)
                    expect(text).to.equal(note.text)
                })
        })

        it('should fail on non user id', () =>
            logic.retrieveNote()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.retrieveNote('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.retrieveNote('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on wrong user id', () => {
            const user = new User(userData)
            const note = new Note({ text: noteText })

            user.notes.push(note)

            return user.save()
                .then(({ notes: [{ id: noteId }] }) => {
                    return logic.retrieveNote(dummyUserId, noteId)
                        .catch(({ message }) => expect(message).to.equal(`no user found with id ${dummyUserId}`))
                })
        })

        it('should fail on no note id', () =>
            logic.retrieveNote(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('note id is not a string'))
        )

        it('should fail on empty note id', () =>
            logic.retrieveNote(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('note id is empty or blank'))
        )

        it('should fail on blank note id', () =>
            logic.retrieveNote(dummyUserId, '       ')
                .catch(({ message }) => expect(message).to.equal('note id is empty or blank'))
        )

        it('should fail on wrong note id', () => {
            const user = new User(userData)
            const note = new Note({ text: noteText })

            user.notes.push(note)

            return user.save()
                .then(({ id: userId }) => {
                    return logic.retrieveNote(userId, dummyNoteId)
                        .catch(({ message }) => expect(message).to.equal(`no note found with id ${dummyNoteId}`))
                })
        })
    })

    describe('list notes', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)

            const notes = indexes.map(index => new Note({ text: `${noteText} ${index}` }))

            user.notes = notes

            return user.save()
                .then(({ id: userId, notes }) => {
                    const validNoteIds = []
                    const validNoteTexts = []

                    notes.forEach(({ id, text }) => {
                        validNoteIds.push(id)
                        validNoteTexts.push(text)
                    })

                    return logic.listNotes(userId)
                        .then(notes => {
                            expect(notes).to.exist
                            expect(notes.length).to.equal(indexes.length)

                            notes.forEach(({ id, text, _id }) => {
                                // expect(validNoteIds.includes(id)).to.be.true
                                // expect(validNoteTexts.includes(text)).to.be.true
                                // or
                                expect(validNoteIds).to.include(id)
                                expect(validNoteTexts).to.include(text)
                                expect(_id).not.to.exist
                            })
                        })
                })
        })

        it('should fail on non user id', () =>
            logic.listNotes()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.listNotes('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.listNotes('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )
    })

    describe('update note', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id: userId }) =>
                    User.findByIdAndUpdate(userId, { $push: { notes: { text: noteText } } }, { new: true })
                        .then(user => {
                            const noteId = user.notes[user.notes.length - 1].id

                            const newNoteText = `${noteText} 2`

                            return logic.updateNote(userId, noteId, newNoteText)
                                .then(res => {
                                    expect(res).to.be.true

                                    return User.findById(userId)
                                })
                                .then(({ [{id, text}] }) => {
                                    expect(id).to.equal(noteId)
                                    expect(text).to.equal(newNoteText)
                                })
                        })
                )
        )
    })

    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)))
})
