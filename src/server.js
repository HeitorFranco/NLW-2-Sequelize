const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const server = express();

const {
  pageLanding,
  pageStudy,
  pageGiveClasses,
  saveClasses,
} = require("./pages");

//configurar nunjucks(template engine)
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
  express: server,
  noCache: true,
});
const PORT = process.env.PORT || 5000;

server
  .use(express.urlencoded({ extended: true }))
  .use(express.static("public"))
  .get("/", pageLanding)
  .get("/study", pageStudy)
  .get("/give-classes", pageGiveClasses)
  .post("/save-classes", saveClasses)
  .get("/sucess", (req, res) => {
    return res.render("sucess.html");
  })
  .listen(PORT);
