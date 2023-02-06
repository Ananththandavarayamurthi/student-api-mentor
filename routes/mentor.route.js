const express=require('express')
const router=express.Router();
const { validatementor, MENTORBACK} = require("../models/mentor.model");
const {validate,STUDENTBACK}=require("../models/student.model")

router.post("/",async(req,res)=>{
    try{
        
        const {error}=validatementor(req.body)
        if(error){
            return res.status(400).send({message: error.details[0].message});
        }

        const newmentor = new MENTORBACK(req.body);

        await newmentor.save((err, data)=> {
            if(err){
                console.log(err)
                return res.status(400).send({message: 'Error while adding new details. Please check the data'});
            }

            res.status(201).send({menid: data._id, message: "details has been added successfully." })
        })

    }catch(error){
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
});

router.get("/allmentor",async(req,res)=>{
    try{
MENTORBACK.find((err,data)=>{
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
router.put('/update/:menID', (req, res) => {
    try{
       MENTORBACK.findByIdAndUpdate({_id: req.params.menID}, {$set: req.body}, (err, data) =>{
            if(err){
                return res.status(400).send({message: 'Error while updating an existing details. Please check the data'})
            }

            res.status(201).send({menid:data._id, message: "details have been updated."})
        })

    }catch(error){
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
});


router.delete("/delete/:menID",(req,res)=>{
    try{
      MENTORBACK.deleteOne({_id:req.params.menID},(err,data)=>{
    if(err){
        res.status(400).send({message:"error while deleting data"})
    }
    res.status(200).send({message:`deleted id ${req.params.menID} successfully`})
})
    }
    catch(error){
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });  
    }
})

router.get('/:menID',async (req, res) => {
    try{
        let mentor= await MENTORBACK.findOne({_id: req.params.menID})
        if(!mentor){
            return res.status(400).send({message: 'invalid mentor id'})
        }

       MENTORBACK.findOne({_id: req.params.menID}, (err, data) => {
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

router.put('/assignstudent/:menID', async (req, res) => {
    try{
        let {email}=req.body
        let student=await STUDENTBACK.findOne({email:email})
        
        if(!student){
            return res.status(400).send({message: 'student is not available'}) 
            
        }  
        let available= await MENTORBACK.findOne({_id:req.params.menID})
        let check = available.studentlist.map(item => item.student_email).includes(student.email)
        if(check){
            return res.status(400).send({message: 'student is already assigned in the list'}) 
            
        }
       let assign = MENTORBACK.findByIdAndUpdate({_id: req.params.menID}, { $push:{ studentlist:{ student_name:student.name,student_email:student.email }}}, (err, data) =>{
            if(err){
                return res.status(400).send({message: 'Error while updating an existing details. Please check the data'})
                
            }
           STUDENTBACK.findOneAndUpdate ({email : student.email}, {$set:{mentor:"assigned"} }, (err) =>{  
                if(err){
                    return res.status(400).send({message: 'Error while updating an existing details. Please check the data'})    
                }    
            })
           return res.status(201).send({menid:data._id, message: "details have been updated."})
            
        })
        if(!assign){
            return res.status(400).send({message: 'Error while updating an existing details. Please check the data'})
            
        }
        
    }catch(error){
        res.status(500).send({
            error,
            message: "Internal Server Error"
        })
    }
});
router.put('/unassigned/:menID', async (req, res) => {
    try{
        let {email}=req.body
        let student=await STUDENTBACK.findOne({email:email})
        
        // if(!student){
        //     return res.status(400).send({message: 'student is not available'})   
        // }  
        // let available= await MENTORBACK.findOne({_id:req.params.menID})
        // let check = available.studentlist.map(item => item.student_email).includes(student.email)
        // if(check){
        //     return res.status(400).send({message: 'student is already assigned in the list'}) 
            
        // }
       let unassign = MENTORBACK.findByIdAndUpdate({_id: req.params.menID}, { $pull:{ studentlist:{ student_name:student.name,student_email:student.email }}}, (err, data) =>{
            if(err){
                return res.status(400).send({message: 'Error while updating an existing details. Please check the data'})
                
            }
           STUDENTBACK.findOneAndUpdate ({email : student.email}, {$set:{mentor:"un-assigned"} }, (err) =>{  
                if(err){
                    return res.status(400).send({message: 'Error while updating an existing details. Please check the data'})    
                }    
            })
           return res.status(201).send({menid:data._id, message: "details have been updated."})
            
        })
        if(!unassign){
            return res.status(400).send({message: 'Error while updating an existing details. Please check the data'})
            
        }
        
    }catch(error){
        res.status(500).send({
            error,
            message: "Internal Server Error"
        })
    }
});

module.exports=router;