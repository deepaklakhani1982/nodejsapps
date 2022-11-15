const mongoose = require('mongoose');

// creating schema
const customerSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    studentClass: {
        type: String
    },
    gender: {
        type: String
    },
    fatherName: {
        type: String
    },
    motherName: {
        type: String
    },
    primaryContactNo: {
        type: String,
        required: true
    },
    alternateContactNo: {
        type: String
    },
    houseFlatNo: {
        type: String
    },
    addressLine1: {
        type: String
    },
    addressLine2: {
        type: String
    },
    zipCode: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    }
    
})

customerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

customerSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, options) {
        return ret;
    }
});

module.exports = mongoose.model('Customer', customerSchema)