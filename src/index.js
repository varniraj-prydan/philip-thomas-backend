const express = require('express');
const dotenv = require("dotenv")
dotenv.config()
require("./helper/db.config")
const bodyparser = require("body-parser")
const cors = require("cors")
const app = express();
const port = process.env.PORT || 8001
app.use(cors())
app.use(express.json())
app.use(bodyparser.json()) 
app.use("/src",express.static("./src"))
app.use(require('./routes/route'))

require('./uploads')
 
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("./uploads"))

app.listen(port,()=>{
    console.log(`Server running on port http://localhost:${port}`);
})