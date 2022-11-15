const {Recipe} = require('../models/recipe')
const {Ingredient} = require('../models/ingredient')
const express = require('express');

const router = express.Router();

router.get('/', async(req, res)=> {
    const recipeList = await Recipe.find();
    if(!recipeList) {
        res.status(501).json({success:false});
    }
    res.send(recipeList);
}) 

router.get('/:id', async(req, res)=> {
    const recipe = await Recipe.findById(req.params.id)
    .populate({
        path: 'ingredients'
    })
    if(!recipe) {
        res.status(501).json({success:false});
    }
    res.status(200).send(recipe);
})

router.post('/', async(req, res)=> {

    // code inside Promise.all returns a promise for every order item, so we have to
    // use Promise.all to combine all promises and then await them using
    // const orderItemsIdsResolved =  await orderItemsIds;
    const ingredientsIds = Promise.all(req.body.ingredients.map(async (ingredientFromReq) =>{
        let ingredient = new Ingredient({
            name: ingredientFromReq.name,
            amount: ingredientFromReq.amount
        })

        ingredient = await ingredient.save();

        return ingredient._id;
    }))
    const ingredientsIdsResolved =  await ingredientsIds;

    let recipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        imagePath: req.body.imagePath,
        ingredients: ingredientsIdsResolved
    });

    recipe = await recipe.save();
    if(!recipe) {
        return res.status(404).send('the recipe cannot be created');
    }
    res.send(recipe);    
})

router.put('/:id',async (req, res)=> {
    console.log(req.params);

    const ingredientsIds = Promise.all(req.body.ingredients.map(async (ingredientFromReq) =>{
        let ingredient = new Ingredient({
            name: ingredientFromReq.name,
            amount: ingredientFromReq.amount
        })

        ingredient = await ingredient.save();

        return ingredient._id;
    }))
    const ingredientsIdsResolved =  await ingredientsIds;

    const recipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            imagePath: req.body.imagePath,
            ingredients: ingredientsIdsResolved
        },
        { new: true}
    )

    if(!recipe)
    return res.status(400).send('the recipe cannot be updated!')

    res.send(recipe);
})

router.delete('/:id', (req, res)=> {
    Recipe.findByIdAndRemove(req.params.id)
    .then(async recipe =>{
        if(recipe) {
            await recipe.ingredients.map(async ingredient => {
                await Ingredient.findByIdAndRemove(ingredient)
            })
            return res.status(200).json({success: true, message: 'the recipe is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "recipe not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})


module.exports=router;