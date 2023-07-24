const mongoose = require("mongoose");

//Creating a new book schema
const   AuthorSchema = mongoose.Schema(
    {
        id: Number,
        name: String,
        books:[String]
    }
);

const AuthorModel = mongoose.model("author", AuthorSchema);

module.exports = AuthorModel;