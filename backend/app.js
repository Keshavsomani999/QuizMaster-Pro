const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const errorMiddleware = require("./middleware/error");
const cors = require("cors")

app.use(express.json())
app.use(cookieParser())


const corsOption = {
    origin:['http://localhost:3000'],
    credentials: true,
    methods:["GET","POST","PUT","DELETE"]
}

app.use(cors(corsOption))
// Route Import
const product = require("./routes/productRoute");
const user = require("./routes/userRoute")

app.use("/api/v1",product);
app.use("/api/v1",user);

// MiddleWare for Error
app.use(errorMiddleware);


module.exports = app  