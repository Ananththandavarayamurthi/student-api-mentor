const express=require('express')
const router=express.Router();
const { validate, STUDENTBACK} = require("../models/student.model");

router.post("/",async(req,res)=>{
    try{
        
        const {error}=validate(req.body)
        if(error){
            return res.status(400).send({message: error.details[0].message});
        }
        
        const newstu = new STUDENTBACK(req.body);

        await newstu.save((err, data)=> {
            if(err){
                return res.status(400).send({message: 'Error while adding new details. Please check the data'});
            }

            res.status(201).send({stuid: data._id, message: "details has been added successfully." })
        })

    }catch(error){
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
});

router.get("/allstudent",async(req,res)=>{
    try{
STUDENTBACK.find((err,data)=>{
    if(err){
        res.status(400).send({message:"error while retriving"})
    }
    res.status(200).send(data);
})
    }
    catch(error){
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });  
    }

})
router.put('/update/:stuID', (req, res) => {
    try{

        
       STUDENTBACK.findByIdAndUpdate ({_id: req.params.stuID}, {$set: req.body}, (err, data) =>{
            if(err){
                return res.status(400).send({message: 'Error while updating an existing details. Please check the data'})
            }

            res.status(201).send({stuid:data._id, message: "details have been updated."
        })
        })

    }catch(error){
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
});


router.delete("/delete/:stuID",(req,res)=>{
    try{
STUDENTBACK.deleteOne({_id:req.params.stuID},(err,data)=>{
    if(err){
        res.status(400).send({message:"error while deleting data"})
    }
    res.status(200).send({message:`deleted id ${req.params.stuID} successfully`})
})
    }
    catch(error){
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });  
    }
})

router.get('/:stuID',async (req, res) => {
    try{
        let student= await STUDENTBACK.findOne({_id: req.params.menID})
        if(!student){
            return res.status(400).send({message: 'invalid student id'})
        }

     STUDENTBACK.findOne({_id: req.params.stuID}, (err, data) => {
            if(err){
                return res.status(400).send({message: 'Error while retrieving an details. Please check the data'})
            }

            res.status(200).send(data);
        })
    }catch(error){
        res.status(500).send({
            message: 'Internal Server Error'
        })
    }
});

router.get('/un-assigned/students',async (req, res) => {
    try{
        // let student= await STUDENTBACK.find({mentor: "un-assigned"})
        // if(!student){
        //     return res.status(400).send({message: 'invalid student id'})
        // }

     STUDENTBACK.find({mentor: "un-assigned"}, (err, data) => {
            if(err){
                return res.status(400).send({message: 'Error while retrieving an details. Please check the data'})
            }

            res.status(200).send(data);
        })
    }catch(error){
        res.status(500).send({
            message: 'Internal Server Errors'
        })
    }
});


module.exports=router;