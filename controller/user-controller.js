const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserModel = require('../models/User');

dotenv.config();

const registerUser = async (req, res) => {
    const { first_name, last_name, email, password, confirm_password } = req.body;
    try {
        const schema = Joi.object({
            first_name: Joi.string().min(3).max(25).required(),
            last_name: Joi.string().min(3).max(25).required(),
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{8,30}$')).required(),
            confirm_password: Joi.any().equal(Joi.ref('password')).required(),
        });

        const validate = schema.validate({ first_name, last_name, email, password, confirm_password });

        if (validate.error) {
            return res.status(400).json({ error: validate.error.details });
        }


        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const payload = {
            first_name,
            last_name,
            email,
            user_id: newUser._id
        };

        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });

        res.status(200).json({
            validate,
            message: "User added successfully",
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add");
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        });

        const validate = schema.validate({ email });
        if (validate.error) {
            res.status(400).json({ error: validate.error.details });
            return;
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            res.status(400).json({ message: 'Email is invalid' });
            return;
        }

        const storedHashedPassword = user.password; 

        const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!passwordMatch) {
            res.status(400).json({ message: 'Password is invalid' });
            return;
        }

        const payload = {
            first_name: user.first_name,
            last_name: user.last_name,
            user_id: user.user_id,
            email: user.email,
        };

        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });

        res.status(200).json({
            validate,
            message: 'Successfully Login',
            token: token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to Authenticate');
    }
};



module.exports = {
    registerUser,
    loginUser
};
