//jshint esversion:6
// Declare modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

let port = 3000;

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
// Declare public folder for assets
app.use(express.static("public"));

// Connect Mongoose
// Remove deprecation warnings
mongoose.connect("mongodb+srv://admin-jordan:pWbok9PEqWSpDre8@todolistcluster-zynix.mongodb.net/blogDB", {
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
