const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')
const multer = require('multer')
var upload = multer();

const app = express();
require('dotenv/config');

// get all routers
const productsRouters = require('./routes/products')
const usersRouters = require('./routes/users')
const categoriesRouters = require('./routes/categories')
const ordersRouters = require('./routes/orders')
const recipesRouters = require('./routes/recipes')
const customerRouters = require('./routes/customer')
const studentClassRouters = require('./routes/studentclassRoute')

const api = process.env.API_URL;

app.use(cors());
app.options('*', cors()); // this means allow all requests from all applications

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(upload.array());

app.use(morgan('tiny'));
//app.use(authJwt()); // this expects to have Bearer token in every incoming request

// This is done to make this application aware that this is a static folder (i.e. API is not needed 
// for accessing this, it can be accessed directly by typing the url),
// reason for doing this is so that files present in this folder could be accessed.
// example - http://localhost:3000/public/uploads/Surface-Pro-7-128GB-1604665289664.png
console.log(__dirname);
app.use('/public/uploads', express.static(__dirname + '/public/uploads')); 


// this is middleware to handle exceptions which are not handled already, if we don't do this then
// big exception messages would go to front hand
// we extracted this code from here and instead created a small error-handler module
/*app.use((err, req, res, next) => { 
    res.status(500).json({message: "server side error"})
})*/
app.use(errorHandler);

// use routes
app.use(`${api}/products`, productsRouters);
app.use(`${api}/categories`, categoriesRouters);
app.use(`${api}/users`, usersRouters);
app.use(`${api}/orders`, ordersRouters);
app.use(`${api}/recipes`, recipesRouters);
app.use(`${api}/customers`, customerRouters);
app.use(`${api}/studentclasses`, studentClassRouters);

mongoose.connect(process.env.DB_CONNECTION_STRING)
.then(()=>{
    console.log('connection to db ok');
})
.catch((err)=> {
    console.log('connection to db failed');
    console.log(err);
})

app.listen(process.env.PORT, ()=> {
    console.log("server listening on port 3000");
})