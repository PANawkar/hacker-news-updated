require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const { JSDOM } = require("jsdom");
const Page = require("./models/blog")
// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors({
    // origin: 'https://hacker-news-vert.vercel.app', // specify the allowed origin
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // specify the allowed HTTP methods
    // credentials: true, // include credentials (cookies, HTTP authentication) in the CORS request
    // optionsSuccessStatus: 204, // set the status code for successful preflight requests
  }));

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

async function hello() {
    let titlesArrayContent = [];
    let urlArrayContent = [];
    let commentsArrayURlContent = [];
    let commentsArrayContent = [];
    let upVotesArrayContent = [];
    let timesArrayContent = [];
  
    for (let i = 0; i < 3; i++) {
      const response = await fetch(`https://news.ycombinator.com/?p=${i + 1}`);
      const html = await response.text();
  
      const dom = new JSDOM(html);
      const document = dom.window.document;
  
      const titles = document.querySelectorAll(".titleline");
      const titlesArray = Array.from(titles);
  
      const comments = document.querySelectorAll(".subtext");
      const commentsArray = Array.from(comments);
  
      // const commentsURL = document.querySelector(".subtext");
      // const commentsURLArray = Array.from(commentsURL);
  
      const upVotes = document.querySelectorAll(".subtext");
      const upVotesArray = Array.from(upVotes);
  
      // const upVotesURL = document.querySelector(".subtext");
      // const upVotesURLArray = Array.from(upVotesURL);
  
      const times = document.querySelectorAll(".age a");
      const timesArray = Array.from(times);
  
      for (let i = 0; i < titlesArray.length; i++) {
        titlesArrayContent.push(titlesArray[i].textContent);
        urlArrayContent.push(
          titlesArray[i].firstElementChild.getAttribute("href")
        );
  
        commentsArrayContent.push(
          commentsArray[i].firstElementChild.lastElementChild.textContent
        );
  
        commentsArrayURlContent.push(
          commentsArray[i].firstElementChild.lastElementChild.getAttribute("href")
        );
        upVotesArrayContent.push(
          upVotesArray[i].firstElementChild.firstElementChild.textContent
        );
        timesArrayContent.push(timesArray[i].textContent);
      }
    }
  
    for (let i = 0; i < titlesArrayContent.length; i++) {
      const existingPage = await Page.findOne({ page: i + 1 });
  
      if (existingPage) {
        // Update the existing record
        try {
          await Page.findOneAndUpdate(
            { page: i + 1 },
            {
              titles: titlesArrayContent[i],
              href: urlArrayContent[i],
              comments: commentsArrayContent[i],
              commentsURL: commentsArrayURlContent[i],
              upVotes: upVotesArrayContent[i],
              times: timesArrayContent[i],
            }
          );
          console.log(`Data for page ${i + 1} updated in MongoDB.`);
        } catch (error) {
          console.error(`Error updating data for page ${i + 1}:`, error);
        }
      } else {
        // Create a new Page instance and save it to MongoDB
        const newPage = new Page({
          page: i + 1,
          titles: titlesArrayContent[i],
          href: urlArrayContent[i],
          comments: commentsArrayContent[i],
          commentsURL: commentsArrayURlContent[i],
          upVotes: upVotesArrayContent[i],
          times: timesArrayContent[i],
        });
        try {
          await newPage.save();
          console.log(`Data for page ${i + 1} saved to MongoDB.`);
        } catch (error) {
          console.error(`Error saving data for page ${i + 1}:`, error);
        }
      }
    }
  }
  
  app.get("/blog", async (req, res) => {
    hello();
    const all = await Page.find();
    console.log(all);
    res.send(all);
  });
 
  

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
