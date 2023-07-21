require("dotenv").config();

const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

const database = require("./database"); //importing our database

const booky = express(); //initializing express
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

// mongoose.connect("mongodb+srv://Gift-Mc-Vane:linconmomanyi97@macvane.pkawbzc.mongodb.net/Booky?retryWrites=true&w=majority", {
    
// }).then(() => console.log("Connection Established"));
mongoose.connect('mongodb://127.0.0.1/my_database');
/* 
    Route: "/"
    Description: Get all books
    Access: Public
    Parameter: NONE
    Method: Get
*/

booky.get("/", (request, response) => {
    return response.json({books: database.books});
});

/* 
    Route: "/is"
    Description: Get specific book based on ISBN
    Access: Public
    Parameter: isbn
    Method: Get
*/

booky.get("/is/:isbn", (request,response) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === request.params.isbn
    );

    if(getSpecificBook.length === 0) {
        return response.json({error: `No book for the ISBN of ${request.params.isbn}`});
    }

    return response.json({books: getSpecificBook});
});

/* 
    Route: "/c"
    Description: Get specific book based on category
    Access: Public
    Parameter: category
    Method: Get
*/

booky.get("/c/:category", (request,response) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(request.params.category)
    )

    if(getSpecificBook.length===0){
        return response.json({error: `No book for the category of ${request.params.category}`})
    }

    return response.json({book: getSpecificBook})
});

/* 
    Route: "/l"
    Description: Get specific book based on language
    Access: Public
    Parameter: language
    Method: Get
*/

booky.get("/l/:language", (request,response) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language.includes(request.params.language)
    )

    if(getSpecificBook.length===0) {
        return response.json({error: `No book for the langauge of ${request.params.language}`})
    }

    return response.json({book: getSpecificBook})
});

/* 
    Route: "/author"
    Description: Get all authors
    Access: Public
    Parameter: NONE
    Method: Get
*/

booky.get("/author", (request,response) => {
    return response.json({authors: database.author});
});

/* 
    Route: "/a"
    Description: Get specific author by id
    Access: Public
    Parameter: NONE
    Method: Get
*/

booky.get("/author/:id", (request,response) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id.includes(request.params.id)
    )

    if(getSpecificAuthor.length===0) {
        return response.json({error: `No author found fot the id ${request.params.id}`});
    }

    return response.json({author: getSpecificAuthor});
});

/* 
    Route: "/author/book"
    Description: Get all authors based on a book 
    Access: Public
    Parameter: ISBN
    Method: Get
*/

booky.get("/author/book/:isbn", (request,response) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(request.params.isbn)
    )

    if(getSpecificAuthor.length===0) {
        return response.json({error: `No author found for the boook of ${request.params.isbn}`});
    }

    return response.json({authors: getSpecificAuthor});
});

/* 
    Route: "/publications"
    Description: Get all publications 
    Access: Public
    Parameter: NONE
    Method: Get
*/

booky.get("/publications", (request,response) => {
    return response.json({publications: database.publication});
});

/* 
    Route: "/pub"
    Description: Get a specific publication
    Access: Public
    Parameter: name
    Method: Get
*/

booky.get("/pub/:name", (request,response) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.name.includes(request.params.name)
    )

    if(getSpecificPublication.length===0) {
        return response.json({error: `No publication found for the name of ${request.params.name}`});
    }

    return response.json({publication: getSpecificPublication});
});

/* 
    Route: "/publication/book"
    Description: Get a specific publication based on a book
    Access: Public
    Parameter: ISBN
    Method: Get
*/

booky.get("/publication/book/:isbn", (request,response) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(request.params.isbn)
    )

    if(getSpecificPublication.length==0) {
        return response.json({error: `No publication found for the book ${request.params.isbn}`});
    }

    return response.json({publication: getSpecificPublication});
});

/* 
    Route: "/book/new"
    Description: Add new book
    Access: Public
    Parameter: NONE
    Method: Get
*/

booky.post("/book/new", (request,response) => {
    const newBook = request.body;
    database.books.push(newBook);
    return response.json({updatedBooks: database.books});
});

/* 
    Route: "/author/new"
    Description: Add new author
    Access: Public
    Parameter: NONE
    Method: Get
*/

booky.post("/author/new", (request,response) => {
    const newAuthor = request.body;
    database.author.push(newAuthor);
    return response.json(database.author);
});

/* 
    Route: "/publication/new"
    Description: Add new publication
    Access: Public
    Parameter: NONE
    Method: Post
*/

booky.post("/publication/new", (request,response) => {
    const newPublication = request.body;
    database.publication.push(newPublication);
    return response.json(database.publication);
});

/* 
    Route: "/publication/update/book"
    Description: Update /add new publication
    Access: Public
    Parameter: isbn
    Method: Put
*/

booky.put("/publication/update/book/:isbn", (request,response) => {
    //Update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === request.body.pubId) {
            return pub.books.push(request.params.isbn);
        }
    });
    //Update the book database
    database.books.forEach((book) => {
        if(book.ISBN === request.body.isbn) {
            book.publications = request.body.pubId;
        }
    });
    
    return response.json(
        {
            books: database.books,
            publications: database.publication,
            message: "Successfully updated publications"
        }
    );
});

/* 
    Route: "book/delete"
    Description: Delete a book
    Access: Public
    Parameter: isbn
    Method: Delete
*/

booky.delete("/book/delete/:isbn", (request,response) => {
    //We wiil filter whichever book that doesn't ,atch the isbn and push it into an updated array
    //And the rest shall be filterd out
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== request.params.isbn 
    );
    
    database.books = updatedBookDatabase;

    return response.json({books: database.books});
});

/* 
    Route: "book/delete"
    Description: Delete a book
    Access: Public
    Parameter: isbn
    Method: Delete
*/


booky.listen(3000, () => {
    console.log("Server is up and running");
});