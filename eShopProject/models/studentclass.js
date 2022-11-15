const mongoose = require('mongoose');

// creating schema
const studentClassSchema = mongoose.Schema({
    order: {
        type: Number,
        required: true,
    },
    class: {
        type: String
    }
})

studentClassSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

studentClassSchema.set('toJSON', {
    virtuals:true,
})

module.exports = mongoose.model('StudentClass', studentClassSchema)