const mongoose = require('mongoose');

// creating schema
const recipeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true
    },
    ingredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required:true
    }]
});

recipeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

recipeSchema.set('toJSON', {
    virtuals:true,
})

// creating model
exports.Recipe = mongoose.model('Recipe', recipeSchema)

