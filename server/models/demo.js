const express = require("express");
const app = express();
const PORT = 4000;
const { JSDOM } = require("jsdom");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/hackernews", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Define a schema for the scraped data
// const pageSchema = new mongoose.Schema({
//   page: Number,
//   titles: String,
//   href: String,
//   comments: String,
//   commentsURL: String,
//   upVotes: String,
//   times: String,
// });

// const Page = mongoose.model("Page", pageSchema);

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

app.get("/", async (req, res) => {
  hello();
  const all = await Page.find();
  console.log(all);
  res.send(all);
});

app.listen(PORT, () => {
  console.log(" Listening  to PORT " + PORT);
});





// const express = require("express");
// const app = express();
// const PORT = 4000;
// const { JSDOM } = require("jsdom");
// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/hackernews", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;

// const pageSchema = new mongoose.Schema({
//   page: Number,
//   titles: String,
//   href: String,
//   comments: String,
//   commentsURL: String,
//   upVotes: String,
//   times: String,
// });

// const Page = mongoose.model("Page", pageSchema);

// async function scrapeHackerNewsPage(pageNumber) {
//   try {
//     const response = await fetch(
//       `https://news.ycombinator.com/?p=${pageNumber}`
//     );
//     const html = await response.text();
//     const dom = new JSDOM(html);
//     const document = dom.window.document;

//     const titleElements = Array.from(document.querySelectorAll(".titleline"));
//     const commentsElements = Array.from(document.querySelectorAll(".subtext"));
//     const timesElements = Array.from(document.querySelectorAll(".age a"));

//     const data = titleElements.map((titleElement, index) => ({
//       page: pageNumber,
//       titles: titleElement.textContent,
//       href: titleElement.firstElementChild.getAttribute("href"),
//       comments:
//         commentsElements[index].firstElementChild.lastElementChild.textContent,
//       commentsURL:
//         commentsElements[index].firstElementChild.lastElementChild.getAttribute(
//           "href"
//         ),
//       upVotes:
//         commentsElements[index].firstElementChild.firstElementChild.textContent,
//       times: timesElements[index].textContent,
//     }));
//     // console.log(data);
//     return data;
//   } catch (error) {
//     console.error(`Error scraping page ${pageNumber}:`, error);
//     return [];
//   }
// }

// async function updateDatabase(data) {
//   for (const entry of data) {
//     console.log(entry);
//     try {
//       await Page.updateOne(
//         { page: entry.page },
//         { $set: entry },
//         { upsert: true }
//       );
//       console.log(`Data for page ${entry.page} updated/saved to MongoDB.`);
//     } catch (error) {
//       console.error(`Error processing data for page ${entry.page}:`, error);
//     }
//   }
// }

// app.get("/", async (req, res) => {
//   const totalPages = 3; // You can determine this dynamically if needed
//   for (let i = 0; i < totalPages; i++) {
//     const data = await scrapeHackerNewsPage(i + 1);
//     // console.log(data);
//     await updateDatabase(data);
//   }
//   res.send("Welcome");
// });

// app.listen(PORT, () => {
//   console.log("Listening to PORT " + PORT);
// });
