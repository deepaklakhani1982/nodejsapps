const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

exports.Ingredient = mongoose.model('Ingredient', ingredientSchema);

