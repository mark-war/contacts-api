const asyncHandler = require('express-async-handler')
const contactObj = require('../models/contactModel')

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    contactObj.find({userid: req.user.id})
    .then(result => {
        res.send(result)
    }).catch(err => {
        res.send(err)
    })
})

//@desc Create Contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    const {name,email,phone} = req.body

    if(!name || !email || !phone) {
        res.status(400).json({error: 'All fields are mandatory.'})
    }

    contactObj.create({
        name, 
        email, 
        phone, 
        userid: req.user.id
    }).then(result => {
        res.send(result)
    }).catch(err => {
        res.send(err)
    })
})

//@desc Get Contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    contactObj.findById(req.params.id)
    .then(result => {
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: 'Contact not found' });
        }
    })
    .catch(err => {
        res.status(500).send(err);
    });
});


//@desc Update Contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    contactObj.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(result => {
        if (result) {
            if(result.userid.toString() !== req.user.id) {
                res.status(403)
                throw new Error('User does not have permission to update other users contact.')
            }
            res.send(result);
        } else {
            res.status(404).send({ message: 'Contact not found' });
        }
    })
    .catch(err => {
        res.status(500).send(err);
    }); 
});


//@desc Delete Contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    contactObj.findByIdAndDelete(req.params.id)
    .then(result => {
        if (result) {
            if(result.userid.toString() !== req.user.id) {
                res.status(403)
                throw new Error('User does not have permission to delete other users contact.')
            }
            res.send({ message: 'Contact deleted successfully' });
        } else {
            res.status(404).send({ message: 'Contact not found' });
        }
    })
    .catch(err => {
        res.status(500).send(err);
    }); 
});


module.exports = {getContacts, createContact, getContact, updateContact, deleteContact}