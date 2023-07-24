const mongoose = require("mongoose");

//Creating a new book schema
const BookSchema = mongoose.Schema(
    {
        ISBN: String,
        title: String,
        pubDate: String,
        language: String,
        author: [Number],
        numPage: Number,
        publication: [Number],
        category: [String]
    }
);

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;