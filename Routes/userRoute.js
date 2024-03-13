const user = require("express").Router();
const userInfo = require("../Models/user");
const bcrypt = require("bcrypt");

/* update user */
user.put("/update/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.salt(15);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(400).send(err);
      }
    }
    try {
      const findUser = await userInfo.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("User updated successfully");
    } catch (err) {
      return res.status(400).send(err);
    }
  } else {
    return res.status(403).json({ message: "You can not update this" });
  }
});
/* delete user */
user.delete("/delete/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {
      const findUser = await userInfo.findByIdAndDelete(req.params.id);
      res.status(200).json("User deleted successfully");
    } catch (err) {
      return res.status(400).send(err);
    }
  } else {
    return res.status(403).json({ message: "You can not delete this" });
  }
});
/* get an user */
user.get("/find/:id", async (req, res) => {
  try {
    const findUser = await userInfo.findById(req.params.id);
    const { password, ...others } = findUser._doc;
    res.status(200).json(others);
  } catch (err) {
    return res.status(400).send(err);
  }
});
/* follow user */
user.put("/follow/:id", async (req, res) => {
  if (req.body.userId != req.params.id) {
    try {
      const findUser = await userInfo.findById(req.params.id);
      const currentUser = await userInfo.findById(req.body.userId);
      if (!findUser.followers.includes(req.body.userId)) {
        await findUser.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).send("User has been followed");
      } else {
        return res
          .status(403)
          .json({ message: "You already follow this account" });
      }
      res.status(200).json(others);
    } catch (err) {
      return res.status(400).send(err);
    }
  } else {
    res.status(401).json({ message: "You cant follow yourself" });
  }
});
/* unfollow user */
user.put("/unfollow/:id", async (req, res) => {
  if (req.body.userId != req.params.id) {
    try {
      const findUser = await userInfo.findById(req.params.id);
      const currentUser = await userInfo.findById(req.body.userId);
      if (findUser.followers.includes(req.body.userId)) {
        await findUser.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        return res.status(200).send("User has been unfollowed");
      } else {
        return res
          .status(403)
          .json({ message: "You dont follow this account" });
      }
      res.status(200).json(others);
    } catch (err) {
      return res.status(400).send(err);
    }
  } else {
    res.status(401).json({ message: "You cant unfollow yourself" });
  }
});

module.exports = user;
