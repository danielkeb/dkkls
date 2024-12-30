const express = require('express');
const router= express.Router();
const {PrismaClient}= require("@prisma/client");
const prisma=  PrismaClient();

router.post('/add', async (req, res)=>{
    try{
        const [name, description]= req.body;
    const objective = await prisma.CourseObjective.create({
        data:{
            name,
            description
        }
    });
    res.status(201).json(objective);
    }catch(err){
        throw err('some thing wrong');
    }
})