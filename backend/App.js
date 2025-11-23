require("dotenv").config();
const express=require("express");
const app=express();
const connectDB=require("./config/database");
const itemRoutes = require("./routes/itemRoutes");
const PORT=process.env.PORT ;
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
const structureRoutes = require("./routes/structureRoutes");
const billRoutes = require("./routes/billRoutes");

connectDB();
app.use(express.json());
app.use(cors());





app.use("/api/items", itemRoutes);  
console.log("ROUTES LOADED:", itemRoutes);
app.use("/api/customers", customerRoutes);

app.use("/api/structure", structureRoutes);
app.use("/api/bills", billRoutes);

app.get('/',(req,res)=>{
    res.json({message:"Hello From node server"});
})

console.log("PORT VALUE:", PORT);


app.listen(PORT , ()=>{
    console.log("Backend Running");
})