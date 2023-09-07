const express = require("express");
const { blogs } = require("./model/index");
const app = express();

//Database Connection
require("./model/index");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//All page
app.get("/", (req, res) => {
  res.render("blog.ejs");
});

//createBlog Page
app.get("/createBlog", (req, res) => {
  res.render("createBlog.ejs");
});

//CreateBlog Post
app.post("/createBlog", async (req, res) => {
  const title = req.body.title;
  const subTitle = req.body.subtitle;
  const description = req.body.description;

  //added data on database
  await blogs.create({
    title: title,
    subTitle: subTitle,
    description: description,
  });
  res.send("form is submitted succesfully");
});

app.listen(3000, () => {
  console.log("project has started at 3000");
});
