const mongoose = require("mongoose");

//Creating a new book schema
const   PublicationSchema = mongoose.Schema(
    {
        id: Number,
        name: String,
        books:[String]
    }
);

const PublicationModel = mongoose.model("publication", PublicationSchema);

module.exports = PublicationModel;