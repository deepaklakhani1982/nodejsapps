const StudentClass = require('../models/studentclass')
const express = require('express');

const router = express.Router();

router.get('/', async(req, res)=> {
    var mysort = { order: 1 };
    const studentClassList = await StudentClass.find().sort(mysort);
    if(!studentClassList) {
        res.status(501).json({success:false});
    }
    res.status(200).send(studentClassList);
})

module.exports=router;