const express = require('express');
const { UserModel } = require('../model/UserModel');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const userRouter = express.Router();

/* Signup /Register Route */
userRouter.post("/signup", async (req, res) => {

    let { email, password, confirm_password } = req.body
    try {
        let isUserPresent = await UserModel.find({ email: email })
        if (isUserPresent.length) {
            return res.status(201).send({ message: "User already exists" })
        }
        if (email && password && confirm_password) {


            if (password === confirm_password) {
                bcrypt.hash(password, 3).then(function (hash) {
                    password = hash
                    confirm_password = hash
                    const newUser = new UserModel({ email, password, confirm_password })
                    newUser.save()

                    res.status(200).send({ message: "User created successfully" })
                });


            } else {
                res.status(201).send({ message: "Password is not same" })
            }
        } else {
            res.status(201).send({ message: "Please provide all the details" })
        }
    } catch (error) {
        res.status(404).send({ message: "Something went wrong" })
    }
})



/* Login Route */

userRouter.post("/login", async (req, res) => {
    let { email, password } = req.body

    if (email && password) {

        try {
            let isUserPresent = await UserModel.find({ email: email })

            if (isUserPresent.length) {
                bcrypt.compare(password, isUserPresent[0].password, function (err, result) {
                    result ? res.status(200).send({ message: "Login successful", token: jwt.sign({ foo: 'bar' }, 'shhhhh') }) : res.status(201).send({ message: "Wrong Credirential" })
                });
            } else {
                res.status(201).send({ message: "No user exists" })
            }

        } catch (error) {
            res.status(404).send({ message: "Something went wrong" })
        }

    }



})


module.exports = { userRouter }