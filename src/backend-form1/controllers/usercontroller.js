const User = require('../models/User');
const jwt = require('jsonwebtoken');
const db = require('..')
const JWT_SECRET = process.env.JWT_SECRET || 'passwordismysecurity';


const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role},
            JWT_SECRET,
            {expiresIn: '1h' }
    );
};


const getAllusers = async(req, res) => {

    try{
        const Users = await User.find().sort({createdAt: -1})
        res.status(201).json({ message: "All users", Users});
    }catch(err){
        res.status(500).json({message: "Error fethcing all users",error: err.message})
    }
}


const getUserbyId = async(req, res) => {

    try{
        const user = await User.findById(req.params.id);
        if(user){
            return res.status(201).json({message: "User is found", user})
        }else{
            return res.status(400).json({message: "User not found"})
        }
    }catch(err){
        res.status(500).json(err.message)
    }
}



const createUser = async(req, res) => {
    try{
        const user = new User(req.body)
        const saveduser = await user.save()
        res.status(200).json({message: "User created", saveduser })
    }catch(err){
        res.status(500).json({message: "Error failed to create user", error: err.message})
    }
}


const updateUser = async(req, res) => {
    try{
        const user =  await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true })
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json({message: "User updated", user})
    }catch(err){
        res.status(500).json({message: "Error updating user", error: err.message})
    }
}


const deleteUser = async(req, res) => {
    try{
        const user =  await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json({message: "User deleted", user})
    }catch(err){
        res.status(500).json({message: "Error updating user", error: err.message})
    }
}

module.exports = {getAllusers, getUserbyId, createUser, updateUser, deleteUser}

