const express = require('express');
const dotenv = require("dotenv")
dotenv.config()
require("./helper/db.config")
const bodyparser = require("body-parser")
const cors = require("cors")
const corsConfig = {
    origin:"*",
    credential:true,
    methods:["GET","POST","PUT","DELETE"]
}
const app = express();
const port = process.env.PORT || 8001
app.options("",cors(corsConfig))
app.use(cors(corsConfig))
app.use(express.json())
app.use(bodyparser.json()) 
app.use("/src",express.static("./src"))
app.use(require('./routes/route'))
// app.use(require('./uploads'))
 
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("./uploads"))

app.listen(port,()=>{
    console.log(`Server running on port http://localhost:${port}`);
})