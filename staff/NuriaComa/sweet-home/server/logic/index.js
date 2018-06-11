'use strict'

const { models: { User, Apartment } } = require('data')

const logic = {

    /**
     * 
     * @param {string} name 
     * @param {string} surname 
     * @param {string} phone
     * @param {string} dni
     * @param {string} password 
     * 
     * @returns {Promise<boolean>}
     */

    registerUser(name, surname, phone, dni, password, apartmentId) {
        return Promise.resolve()
            .then(() => {

                if (typeof name !== 'string') throw Error('name is not a string')

                if (!(name = name.trim()).length) throw Error('name is empty or blank')

                if (typeof surname !== 'string') throw Error('surname is not a string')

                if (!(surname = surname.trim())) throw Error('surname is empty or blank')

                if (typeof phone !== 'string') throw Error('phone is not a string')

                if ((phone = phone.trim()).length === 0) throw Error('phone is empty or blank')

                if (typeof dni !== 'string') throw Error('dni is not a string')

                if ((dni = dni.trim()).length === 0) throw Error('dni is empty or blank')

                if (typeof password !== 'string') throw Error('password is not a string')

                if ((apartmentId = apartmentId.trim()).length === 0) throw Error('apartmentId is empty or blank')

                if (typeof apartmentId !== 'string') throw Error('apartmentId is not a string')

                if ((apartmentId = apartmentId.trim()).length === 0) throw Error('apartmentId is empty or blank')

                return User.findOne({ dni })
                    .then(user => {


                        if (user) throw Error(`user with dni ${dni} already exists`)

                        return User.create({ name, surname, phone, dni, password, apartmentId })
                            .then(() => true)
                    })
            })
    },

    /**
     * 
     * @param {string} dni
     * @param {string} password 
     * 
     * @returns {Promise<string>}
     */
    authenticateUser(dni, password) {
        return Promise.resolve()
            .then(() => {

                if (typeof dni !== 'string') throw Error('user dni is not a string')

                if (!(dni = dni.trim()).length) throw Error('user dni is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                return User.findOne({ dni, password })
                    .then(user => {


                        if (!user) throw Error('wrong credentials')

                        return { id: user.id, apartmentId: user.apartmentId }
                    })
            })
    },

    /**
    * 
    * @param {string} id
    * 
    * @returns {Promise<User>} 
    */
    retrieveUser(id) {
        return Promise.resolve()
            .then(() => {
                if (typeof id !== 'string') throw Error('user id is not a string')

                if (!(id = id.trim()).length) throw Error('user id is empty or blank')

                return User.findById(id).select({ _id: 0, name: 1, surname: 1, phone: 1, dni: 1 })
            })
            .then(user => {
                if (!user) throw Error(`no user found with id ${id}`)

                return user
            })
    },
    /**
    * 
    * @param {string} id 
    * @param {string} name 
    * @param {string} surname 
    * @param {string} phone
    * @param {string} dni
    * @param {string} password 
    * @param {string} newPhone
    * @param {string} newPassword 
    * 
    * @returns {Promise<boolean>}
    */
    updateUser(id, name, surname, phone, dni, password, newPassword) {
        return Promise.resolve()
            .then(() => {
                if (typeof id !== 'string') throw Error('user id is not a string')

                if (!(id = id.trim()).length) throw Error('user id is empty or blank')

                if (typeof name !== 'string') throw Error('user name is not a string')

                if (!(name = name.trim()).length) throw Error('user name is empty or blank')

                if (typeof surname !== 'string') throw Error('user surname is not a string')

                if ((surname = surname.trim()).length === 0) throw Error('user surname is empty or blank')

                if (typeof phone !== 'string') throw Error('user phone is not a string')

                if (!(phone = phone.trim()).length) throw Error('user phone is empty or blank')

                if (typeof dni !== 'string') throw Error('user dni is not a string')

                if (!(dni = dni.trim()).length) throw Error('user dni is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                return User.findOne({ dni, password })
            })
            .then(user => {
                if (!user) throw Error('wrong credentials')

                if (user.id !== id) throw Error(`no user found with id ${id} for given credentials`)

                return user
            })
            .then(user => {
                user.name = name
                user.surname = surname
                user.password = newPassword ? newPassword : password

                return user.save()
            })
            .then(() => true)
    },

    listUsers(apartmentId) {

        return Promise.resolve()
            .then(() => {

                return User.find({ apartmentId })
                    .then(users => {
                        if (!users) throw Error(`no users found`)

                        return users
                    })

            })
    },

    /**
     * 
     * @param {string} id 
     * @param {string} email 
     * @param {string} password 
     * 
     * @returns {Promise<boolean>}
     */
    unregisterUser(id, dni, password) {
        return Promise.resolve()
            .then(() => {



                if (typeof id !== 'string') throw Error('user id is not a string')

                if (!(id = id.trim()).length) throw Error('user id is empty or blank')

                if (typeof dni !== 'string') throw Error('user dni is not a string')

                if (!(dni = dni.trim()).length) throw Error('user dni is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                return User.findOne({ dni, password })
            })
            .then(user => {
                if (!user) throw Error('wrong credentials')

                if (user.id !== id) throw Error(`no user found with id ${id} for given credentials`)

                return user.remove()
            })
            .then(() => true)
    },

    registerApartment(name, address, phone) {
        return Promise.resolve()
            .then(() => {

                if (typeof name !== 'string') throw Error('user name is not a string')

                if (!(name = name.trim()).length) throw Error('user name is empty or blank')

                if (typeof address !== 'string') throw Error('user address is not a string')

                if (!(address = address.trim()).length) throw Error('user address is empty or blank')

                if (typeof phone !== 'string') throw Error('user phone is not a string')

                if ((phone = phone.trim()).length === 0) throw Error('user phone is empty or blank')

                // return Apartment.findOne({ apartmentId })
                //     .then(apartment => {

                //     if (apartment) throw Error(`apartment with apartmentId ${apartmentId} already exists`)

                return Apartment.create({ name, address, phone })
                    .then(({id}) => {
                        
                        return id
                        
                    })
            })
    },
    
    listApartment(apartmentId){

        return Promise.resolve()
        .then(()=>{
            console.log('logic-server-apartmentId', apartmentId)
            return Apartment.findById( apartmentId )
            .then(apartments =>{
                if (!apartments) throw Error (`no apartment found`)

                console.log('logic-server-apartment', apartments)
                return apartments
            })
        })

    }
}

module.exports = logic
