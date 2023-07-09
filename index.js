import express from "express"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import isAuthenticated from "./isAuthentic.js"
import connectDb from "./connectDb.js";
import User from "./User.js";

const app=express();

app.set("view engine","ejs");
app.set("views","views");
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

connectDb();


app.get("/", isAuthenticated ,(req,res)=>{
    const {name,email,password} = req.user;
    res.render("logout",{name});
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",async (req,res)=>{
    const {name,email,password} = req.body;

    let user = await User.findOne({email})
    if(!user)
    {
        return res.redirect("/register")
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        return res.render("login",{message : "INCORRECT PASSWORD"})
    }

    const token = jwt.sign({_id : user._id },"sridhar")
    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000)
    })
    res.redirect("/");
})

app.post("/register",async (req,res)=>{
    const {name,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    await User.create({
        name,email,password:hashedPassword
    })
    res.redirect("/login");
})

app.get("/logout",(req,res)=>{
    res.cookie("token",null,{
        httpOnly:true,
        expires:new Date(Date.now())
    })
    res.redirect("/");
})

app.listen(3000 , ()=>{
    console.log("server is running");
})