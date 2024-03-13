const posts = require("express").Router();
const postInfo = require("../Models/post.js");
const userInfo = require("../Models/user.js");

/* create a post */
posts.post("/create", async (req, res) => {
  const newPost = new postInfo({
    userId: req.body.userId,
    desc: req.body.desc,
  });
  console.log(newPost);
  try {
    const savedPost = await newPost.save();
    console.log(1);
    return res.status(200).send(savedPost);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/* update a post */
posts.put("/update/:id", async (req, res) => {
  try {
    const post = await postInfo.findById(req.params.id);
    if (post.userId == req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({ message: "Post updated successfully" });
    }
  } catch (err) {
    res.status(401).send(err);
  }
});

/* delete a post */
posts.delete("/delete/:id", async (req, res) => {
  try {
    const post = await postInfo.findById(req.params.id);
    if (post.userId == req.body.userId) {
      await post.deleteOne({ $id: req.params.id });
      res.status(200).json({ message: "Post deleted successfully" });
    }
  } catch (err) {
    res.status(401).send(err);
  }
});

/* like a post */
posts.put("/like/:id", async (req, res) => {
  try {
    const post = await postInfo.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json({ message: "This post has been liked" });
    } else {
      return res.status(401).json({ message: "You already liked this post" });
    }
  } catch (err) {
    res.status(402).send(err);
  }
});

/* get a post */
posts.get("/find/:id", async (req, res) => {
  try {
    const post = await postInfo.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    res.status(402).send(err);
  }
});

/* get all timeline posts */
posts.get("/find/:id", async (req, res) => {
  try {
    const cUser = await userInfo.findById(req.body.userId);
    const posts = await postInfo.findById({ userId: cUser._id });
    const friendsPosts = await Promise.all(
      cUser.followings.map((id) => {
        return postInfo.find({ userId: id });
      })
    );
    return res.status(200).json(post);
  } catch (err) {
    res.status(402).send(err);
  }
});

module.exports = posts;
