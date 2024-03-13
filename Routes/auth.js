const auth = require("express").Router();
const bcrypt = require("bcrypt");

const userInfo = require("../Models/user");

/* Register user */
auth.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(15);
    const hashed = await bcrypt.hash(req.body.password, salt);

    const Userdata = new userInfo({
      username: req.body.username,
      email: req.body.email,
      password: hashed,
    });

    const savedUser = await Userdata.save();
    return res.status(200).json(savedUser);
  } catch (err) {
    return res.status(401).send(err);
  }
});

/* Login user */
auth.post("/login", async (req, res) => {
  try {
    const findUser = await userInfo.findOne({
      email: req.body.email,
    });

    const validPass = await bcrypt.compare(
      req.body.password,
      findUser.password
    );

    if (!findUser || !validPass) {
      return res.status(404).send("Wrong email or password");
    }
    return res.status(200).json("Login successfull");
  } catch (err) {
    res.status(401).json(err);
  }
});
module.exports = auth;
