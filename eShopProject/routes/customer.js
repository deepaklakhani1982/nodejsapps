const Customer = require('../models/customer')
const express = require('express');

const router = express.Router();

router.get('/', async(req, res)=> {
    const customerList =  await Customer.find();
    if(!customerList) {
        res.status(501).json({success:false});
    }
    res.send(customerList);    
})

router.get('/:id', async(req, res)=> {
    const customer = await Customer.findById(req.params.id);
    if(!customer) {
        res.status(501).json({message:'The customer with the given ID was not found.'});
    }
    res.send(customer);
})

router.post('/', async (req,res)=>{
    console.log(req.body);
    let customer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        studentClass: req.body.studentClass,
        gender: req.body.gender,
        fatherName: req.body.fatherName,
        motherName: req.body.motherName,
        primaryContactNo: req.body.primaryContactNo,
        alternateContactNo: req.body.alternateContactNo,
        houseFlatNo: req.body.address.houseFlatNo,
        addressLine1: req.body.address.addressLine1,
        addressLine2: req.body.address.addressLine2,
        zipCode: req.body.address.zipCode,
        city: req.body.address.city,
        state: req.body.address.state
    })
    customer = await customer.save();

    if(!customer)
    return res.status(400).send('the customer cannot be created!')

    res.send(customer);
})

router.put('/:id',async (req, res)=> {

    const customerExist = await Customer.findById(req.params.id);
    console.log(req.body);

    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            studentClass: req.body.studentClass,
            gender: req.body.gender,
            fatherName: req.body.fatherName,
            motherName: req.body.motherName,
            primaryContactNo: req.body.primaryContactNo,
            alternateContactNo: req.body.alternateContactNo,
            houseFlatNo: req.body.address.houseFlatNo,
            addressLine1: req.body.address.addressLine1,
            addressLine2: req.body.address.addressLine2,
            zipCode: req.body.address.zipCode,
            city: req.body.address.city,
            state: req.body.address.state
        },
        { new: true}
    )

    if(!customer)
    return res.status(400).send('the customer cannot be updated!')

    res.send(customer);
})

module.exports=router;