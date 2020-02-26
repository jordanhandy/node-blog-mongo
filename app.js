//jshint esversion:6
// Declare modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

let port = process.env.PORT || 3000;

const homeStartingContent = "Welcome to the home page.";
const aboutContent = "This about page is simply a placeholder.  This project allows you to post new items to a fictional blog";
const contactContent = "Please contact me through jordanhandy@vivaldi.net";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
// Declare public folder for assets
app.use(express.static("public"));

// Connect Mongoose
// Remove deprecation warnings
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});
// Create db item Schema
const postsSchema = new mongoose.Schema({
  title: String,
  contents: String
});
// Mongoose  post Model
const Post = mongoose.model("Post", postsSchema);


// Routes
// Home
app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    newBlogPosts: posts
  });
});
});
// About
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});
// Contact
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});
// Compose page
app.get("/compose", function(req, res) {
  res.render("compose")
});
// 404 Error page
app.get("/404", function(req,res){
  res.render("error");
});

// /Posts subpage with wildcard "Post ID"
app.get("/posts/:postId", function(req, res) {
  // Set requestedPostId to the postID in the page
  const requestedPostId = req.params.postId;
  const post = new Post({
    title: req.body.postTitle,
    contents: req.body.postContent
  });
  // Count the DB documents.  If there's nothing there, throw up a 404
  mongoose.connection.db.collection('posts').countDocuments(function(err, count) {
  if (count === 0) {
    res.redirect("/404")
  }});
  // Find a post, given the id
  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {
    if (err){
      // if an error is thrown, throw up a 404
      res.redirect("/404");
    }
    else{
      // else render the page with a post title and content
    res.render("post",{
      postTitle: post.title,
      postContent: post.contents
    });
  }
});
});
// Post Compose page
// Post blogpost object
app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    contents: req.body.postContent
  });
  // Push to array
  // Redirect back home
  post.save(function(err){
    if(!err){
  res.redirect("/");
    }
  });

});

app.listen(process.env.PORT || port, function() {
  console.log("Server started on port" + port);
});
