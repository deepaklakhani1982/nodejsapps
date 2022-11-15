const mongoose = require('mongoose')

// creating schema
const productShema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String        
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 500
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

productShema.virtual('id').get(function() {
    return this._id.toHexString();
})

productShema.set('toJSON', {
    virtuals:true,
})

// creating model
//exports.Product = mongoose.model('Product', productShema)
module.exports = mongoose.model('Product', productShema)