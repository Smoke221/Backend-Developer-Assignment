const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { domainModel } = require("../models/domainModel");

const router = express.Router();

router.post("/scrape", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    //const urlInfoExists = await domainModel.find({ domain: url });

    // Make an HTTP request to the provided URL
    const response = await axios.get(url);
    const html = response.data;

    // Use Cheerio to parse the HTML content
    const $ = cheerio.load(html);

    const text = $("body").text();
    const wordCount = text.split(/\s+/).length;

    // Extracting media links
    const mediaLinks = [];
    $("img").each((index, element) => {
      const src = $(element).attr("src");
      if (src) {
        mediaLinks.push(src);
      }
    });

    // Extracting web links
    const webLinks = [];
    $("a").each((index, element) => {
      webLinks.push($(element).attr("href"));
    });

    const scrapedData = await new domainModel({
      domain: url,
      wordCount,
      mediaLinks,
      webLinks,
    });
    await scrapedData.save();
    res.status(200).json({ message: "Data stored in db" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = { router };
