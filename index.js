
const express = require('express');
require('dotenv').config()
var cors = require('cors');
const { connection } = require('./config/db');
const { userRouter } = require('./controller/UserController');
const { employeeRouter } = require('./controller/EmployeeController');

const app = express();
app.use(express.json());
app.use(cors())

/* Home Route */
app.get("/", (req, res) => {
    res.send({ message: "welcome to employe management system" })
})
/* User Router for login & signup */
app.use("/", userRouter)

/* Employee Route for crud operation */
app.use("/",employeeRouter)

/* Checking Server & DB */
app.listen(process.env.port, async () => {
    try {
        await connection()
        console.log("Connected")
    } catch (error) {
        console.log(error)
    }
    console.log("server is runnning")
})