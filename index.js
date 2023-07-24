require("dotenv").config();

const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

        //importing our database
const database = require("./database/database"); 

        //Models
const BookModel = require("./Database/books");
const AuthorModel = require("./Database/author");
const PublicationModel = require("./Database/publication");

        //initializing 
const booky = express(); 
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

        //Connecting to our mongodb
        //Since this is vital information it needs to be kept in a separate folder called (.env) but first yoy have to install dotenv
 mongoose.connect(process.env.MONGO_URL).then( () => console.log("Connection Established"));

        /***** GET ****/
/* 
    Route: "/"
    Description: Get all books
    Access: Public
    Parameter: NONE
    Method: Get
*/

booky.get("/",async (request,response) => {
    const getAllBooks = await BookModel.find();
    return response.json(getAllBooks);
});

/* 
    Route: "/is"
    Description: Get specific book based on ISBN
    Access: Public
    Parameter: isbn
    Method: Get
*/

booky.get("/is/:isbn",async (request,response) => {
    const getSpecificBook = await BookModel.findone({ISBN: request.params.isbn});

    if(!getSpecificBook) {
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

booky.get("/c/:category",async (request,response) => {
    const getSpecificBook = await BookModel.findone({category: request.params.category});

    if(!getSpecificBook){
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

    return response.json({book: getSpecificBook});
});

/* 
    Route: "/author"
    Description: Get all authors
    Access: Public
    Parameter: NONE
    Method: Get
*/

booky.get("/",async (request,response) => {
    const getAllAuthors = await AuthorModel.find();
    return response.json(getAllAuthors);
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

booky.get("/",async (request,response) => {
    const getAllPublications = await PublicationModel.find();
    return response.json(getAllPublications);
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


        /****   POST ****/
/* 
    Route: "/book/new"
    Description: Add new book
    Access: Public
    Parameter: NONE
    Method: POST
*/

booky.post("/book/new",async (request,response) => {
    const {  newBook  } = request.body;
    const addNewBook = BookModel.create(newBook);
    return response.json({
        books: addNewBook,
        message: "Book was added"
    });
});

/* 
    Route: "/author/new"
    Description: Add new author
    Access: Public
    Parameter: NONE
    Method: POST
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


        /****  PUT *****/
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
    Route: "/book/update"
    Description: Update a book
    Access: Public
    Parameter: isbn
    Method: PUT
*/

booky.put("/book/update/:isbn", async (request,response) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: request.params.isbn
        },
        {
            title: request.body.book.Title
        },
        {
            new: true //shows everything to the fronnt-end
        }
    );

    return response.json({books: updatedBook});
});

/* 
    Route: "/book/update"
    Description: Update a book
    Access: Public
    Parameter: isbn
    Method: PUT
*/

booky.put("/book/author/update/:isbn",async (request,response) => {
    //Update book data
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: request.params.isbn
        },
        {
            $addToSet: {
                authors: request.body.newAthor
            }
        },
        {
            new: true
        }
    );

    //Updating the author database
    const updatedAuthor = await BookModel.findOneAndUpdate(
        {
            id: request.body.newAuthor
        },
        {
            $addToSet: {
                books: request.params.isbn
            }
        },
        {
            new: true
        }
    );

    return response.json({
        books: updatedBook,
        authors: updatedAuthor
    });
});

                /*****DELETE********/
/* 
    Route: "book/delete"
    Description: Delete a book
    Access: Public
    Parameter: isbn
    Method: Delete
*/

booky.delete("/book/delete/:isbn",async (request,response) => {
    //We wiil filter whichever book that doesn't ,atch the isbn and push it into an updated array
    //And the rest shall be filterd out
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: request.params.isbn
        }
    );

    return response.json({books: updatedBookDatabase});
});

/* 
    Route: "book/delete"
    Description: Delete a book
    Access: Public
    Parameter: isbn
    Method: Delete
*/



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