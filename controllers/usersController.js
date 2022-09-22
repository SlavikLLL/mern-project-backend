const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const getAllUsers = asyncHandler (async(req,res)=>{
    const users = await User.find().select('-password').lean();
    if(!users?.length){
        return res.status(400).json({message:'no users found'});
    }
    res.json(users);
})

const createNewUser = asyncHandler (async(req,res)=>{
const {username,password,roles} = req.body;
if(!username || !password || !Array.isArray(roles) || !roles.length){
    return res.status(400).json({message:'All fields  are required'});
}   
const duplicate = await User.findOne({username}).lean().exec();
if(duplicate){
    return res.status(409).json({message:'User already exists'})
}
const hash = await bcrypt.hash(password,10);
const userObject = {username,'password':hash,roles}
const user = await User.create(userObject)
if(user){
    res.status(201).json({message:`New user ${username} created`})
}else {
    res.status(400).json({message:'invalid data'})
}
})

const updateUser = asyncHandler (async(req,res)=>{
    const {id,username,roles,active,password} = req.body;
    if(!username || !password || !Array.isArray(roles) || !roles.length || !id || active !='boolean'){
        return res.status(400).json({message:'All fields  are required'});
    }
    const user = await User.findById(id).exec();
    if(!user){
        return res.status(400).json({message:"user not founded"});
    }
    const duplicate = await User.findOne({username}).lean().exec();
    if(duplicate && duplicate?._id.toString()!==id) {
        return res.status(409)
    }
    user.username = username;
    user.active = active;
    user.roles = roles;

    if(password){
        user.password = await bcrypt.hash(password,10);
    }

    const updateUser = await User.save();
    res.json(updateUser)
})

const deleteUser = asyncHandler (async(req,res)=>{
    const {id} = req.body;
    if(!id){
        return res.json(400);
    }   
    const notes = await Note.findOne({user:id}).lean().exec()
    if(notes?.length){
        return res.json(400);
    }
    const user = await User.findById({id}).exec()
    if(!user){
        return res.status(400);
    }
    const result = await user.deleteOne();
    
res.json(result);


})

module.exports ={
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}