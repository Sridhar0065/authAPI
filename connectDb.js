import mongoose from "mongoose"

const connectDb = ()=>{mongoose.connect("mongodb://localhost:27017",{
    dbName : "todos"
}).then(()=>{
    console.log("database connected successfully")
})
.catch((e)=>{
    console.log(e);
})}

export default connectDb