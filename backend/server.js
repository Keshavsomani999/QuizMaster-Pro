const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database") 

// Handling Unchaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the Server due to Uncaught Exception`);
    process.exit(1);
})


//config
dotenv.config({path:"backend/config/config.env"})


// database
connectDatabase()



const server =  app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
} ) 

// unhandle projection rejection
process.on("unhandledRejection",err=>{
    console.log(`Error:  ${err.message}`);
    console.log(`Shutting down the Server due to Unhandled Promis Rejection`);

    server.close(()=>{
        process.exit(1);
    })

})