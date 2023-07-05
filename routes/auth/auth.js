const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Validation of user Inputs prerequisites
const Joi = require('@hapi/joi');
// joi schema for validation for register
const registerSchema = Joi.object({
    fname: Joi.string().min(3).required(),
    lname: Joi.string().min(3).required(),
    email: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
});
// signup user
router.post('/register', async (req, res) => {
    // check if user E-Mail already exists
    const emailExist = await User.findOne({ email: req.body.email });
    // if E-Mail exist then return
    if (emailExist) {
        res.status(400).send("Email already exists");
        return;
    }

    // Hashing the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // on process of adding New User
    const user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: hashedPassword,
    });

    //
    try {
        // validation of user inputs
        const { error } = await registerSchema.validateAsync(req.body);
        // we can just get the Error(IF EXISTS) with object deconstruction
        // if error exists then send back the Error
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        } else {
            // new User is added
            const saveUser = await user.save();
            res.status(200).send("user created");
        }

    } catch (error) {
        res.status(500).send(error);
    }

});
//joi schema for validation for login
const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});
// LOGIN USER
router.post("/login", async (req, res) => {
    // checking if user email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Incorrect Email- ID");

    // checking if user password matches
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Incorrect Password");
    //
    try {
        // validation of user inputs
        const { error } = await loginSchema.validateAsync(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        else {
            res.send("success");
            // sending back the token
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            res.header("auth-token", token).send(token);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});





//
module.exports = router;
