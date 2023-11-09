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

    // Check if the website is already present in the database
    const existingData = await domainModel.findOne({ domain: url });

    if (existingData) {
      return res.status(200).json({ message: "Domain already exists"});
    }

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

router.get("/all", async (req, res) => {
  try {
    const allDomains = await domainModel.find();

    res.status(200).json({ message: "Retrived data", data: allDomains });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

router.patch("/update", async (req, res) => {
  try {
    const { id, favorite } = req.body;
    const updatedData = await domainModel.findByIdAndUpdate(
      id,
      { favorite: favorite },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Data not found" });
    }

      res.json({ message: "Favorite updated" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const pId = req.params.id;
    const domainExists = await domainModel.findByIdAndDelete({_id:pId});

    if (!domainExists) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = { router };
