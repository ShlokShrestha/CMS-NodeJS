const express = require("express");
const { blogs, users } = require("./model/index");

const app = express();
const bcrypt = require("bcryptjs");
app.use(express.static("public"));

//Database Connection
require("./model/index");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//All blog page(homePage)
app.get("/", async (req, res) => {
  const allblogs = await blogs.findAll();
  res.render("blog.ejs", { blog: allblogs });
});

//createBlog Page
app.get("/createBlog", (req, res) => {
  res.render("createBlog.ejs");
});

//CreateBlog Post
app.post("/createBlog", async (req, res) => {
  const title = req.body.title;
  const subTitle = req.body.subTitle;
  const description = req.body.description;

  //added data on database
  await blogs.create({
    title: title,
    subTitle: subTitle,
    description: description,
  });
  res.redirect("/");
});

//Create Blog Detail Page
app.get("/blogDetail/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await blogs.findAll({
    where: {
      id: id,
    },
  });
  res.render("blogDetail.ejs", { blogPage: blog });
});
//Delete Blog
app.get("/deleteBlog/:id", async (req, res) => {
  const id = req.params.id;
  await blogs.destroy({
    where: {
      id: id,
    },
  });

  res.redirect("/");
});
//update form
app.get("/editBlog/:id", async (req, res) => {
  const id = req.params.id;

  const blog = await blogs.findAll({
    where: {
      id: id,
    },
  });

  res.render("editBlog.ejs", { blog: blog });
});

app.post("/editBlog/:id", async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const subTitle = req.body.subTitle;
  const description = req.body.description;
  console.log(req.body);
  await blogs.update(
    {
      title: title,
      subTitle: subTitle,
      description: description,
    },
    {
      where: {
        id: id,
      },
    }
  );
  res.redirect("/");
});

//register
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !email || !password) {
    return res.send("please provide email, username, password");
  }
  await users.create({
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 10),
  });
  res.redirect("/");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const userExists = await users.findAll({
    where: {
      email: email,
    },
  });
  if (userExists.length > 0) {
    const isMatch = bcrypt.compareSync(password, userExists[0].password);
    if (isMatch) {
      res.send("logged in sucessfully");
    } else {
      res.send("Doesnot Match with email and password");
    }
  } else {
    res.send("Invalid Email or Password");
  }
});
app.listen(3000, () => {
  console.log("project has started at 3000");
});
