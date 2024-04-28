const express = require('express');
const dotenv = require("dotenv")
dotenv.config()
const bodyparser = require("body-parser")
const cors = require("cors")
const app = express();
const port = process.env.PORT || 8001
app.use(cors())
app.use(express.json())
app.use(bodyparser.json())
app.use("/src",express.static("./src"))

app.listen(port,()=>{
    console.log(`Server running on port http://localhost:${port}`);
})
