const mongoose=require("mongoose");

const connectDB =async()=>{

    try{
        const cn= await mongoose.connect(process.env.MONGO_URI);
        console.log("db connection successful");
    }
    catch(e){
        console.log("Error : ", e.message);
        process.exit();
    }
}

module.exports=connectDB;