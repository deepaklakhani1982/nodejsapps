//const {Product} = require('../models/product')
const Product = require('../models/product')
const {Category} = require('../models/category')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.get('/all', async(req, res)=> {
    const prodList = await Product.find().populate('category')
    // const prodList = await Product.find().select('name image') // this would return just the name and image of all products
    res.send(prodList);
}) 

// localhost:3000/api/v1/products?categories=2342342,234234
// categories is query parameter
router.get('/', async(req, res)=> {
    let filter = {};
    if(req.query.categories) {
        filter = {category: req.query.categories.split(',')};
    }

    // format of filter is {name: ["cake1", "cake2"]}
    const productList = await Product.find(filter).populate('category');
    if(!productList) {
        res.send(500).json({success:false});
    }
    res.send(productList);
})

// id is url parameter
router.get('/:id', async(req, res)=> {
    const product = await Product.findById(req.params.id).populate('category'); 
    // .populate('category') - this is done so we get category details also corresponding to product category id

    if(!product) {
        res.status(501).json({success:false});
    }
    res.send(product);
})

// uploadOptions.single('image') - this means we are uploading a single file and name of that file is image
router.post('/', uploadOptions.single('image'), async(req, res)=> {
    // check if category is valid
    console.log(req.body);    
    let category = await Category.findById(req.body.category);
    if(!category) {
        res.status(400).send('Invalid Category!');
    }

   // const file = req.file;
   // if (!file) return res.status(400).send('No image in the request');

    const basePath = `${req.protocol}//${req.get('host')}/public/uploads/`;
    const filename = req.file.filename; // as we are using multer, here filename would already be changed in format defined in multer.diskStorage 

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${filename}`,
        //image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,        
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    product = await product.save()
    if(!product) {
        res.status(500).send('product cannot be created!')
    }

    res.send(product);
})

router.put('/:id', uploadOptions.single('image'), async(req, res)=> {

    // check if id is in correct format, if we pass object id in invalid format
    // then programs gets hung forever.
    // othr way to get rid of hanging issue is to use Promise, 
    // 3rd way is to catch the exception by putting try/catch around findByIdAndUpdate call and in the
    // catch block send a response.
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }

    // check if category is valid
    let category = await Category.findById(req.body.category);
    if(!category) {
        res.status(400).send('Invalid Category!')
    }

    // check if product exists
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,        
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        {new: true}
    );

    if(!updatedProduct){
        return res.status(500).send('product cannot be updated!')
    }

    return res.send(updatedProduct);
})

router.delete('/:id', async(req, res)=>{
    Product.findByIdAndRemove(req.params.id)
    .then((product) => {
        if(product) {
            return res.status(200).json({success:true, message:"the product was deleted"});
        } else {
            return res.status(404).json({success:false, message:"the product was not found"});
        }
    }).catch((err)=> {
        return res.status(400).json({success:false, error:err});
    })
})

router.get(`/get/count`, async (req, res) =>{
    Product.countDocuments({}, function(err, count) {
        res.send({
            productCount: count
        });
    });
})

router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count);
    // count returned above is of type string, to convert it into number we had to add + before it 

    if(!products) {
        res.status(500).json({success: false})
    } 
    res.send(products);
})

// uploadOptions.array('images', 10) means mean upload a set of files and name of the field in request is
// images and 10 is maximum number of files in images array.
router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        { new: true }
    );

    if (!product) return res.status(500).send('the gallery cannot be updated!');

    res.send(product);
});

module.exports = router;