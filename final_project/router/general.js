const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  let bookFound = null;
  for (const key in books) {
    if (books[key].isbn === isbn) {
      bookFound = books[key];
      break;
    }
  }

  if (bookFound) {
      return res.status(200).json(bookFound);
  } else {
      return res.status(404).json({ message: "Book not found" });
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase(); // Get the author from the request parameters and convert to lowercase
  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author
  );

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks); // Return the list of books by the author if found
  } else {
    return res.status(404).json({ message: "No books found by this author" }); // Return an error if no books are found
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();  // Get the title from the request parameters and convert to lowercase
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);

  if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);  // Return the list of books with the title if found
  } else {
      return res.status(404).json({ message: "No books found with this title" });  // Return an error if no books are found
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve ISBN from request parameters
    let bookFound = null;
    for (const key in books) {
      if (books[key].isbn === isbn) {
        bookFound = books[key];
        break;
      }
    }
  
    if (bookFound) {
        return res.status(200).json(bookFound.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
  
});

// Task 10: 
const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch books');
    }
  };
  public_users.get('/', async (req, res) => {
    try { 
      const bookList = await fetchBooks();
      return res.status(200).json(bookList); 
    } catch (error) {
      return res.status(500).json({ message: error.message }); 
    }
  });
  
  
  // Task 11: Get book details based on ISBN using async-await
  public_users.get("/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
  
    try {    
      const bookFound = await new Promise((resolve, reject) => {
        let found = null;
        for (const key in books) {
          if (books[key].isbn === isbn) {
            found = books[key];
            break;
          }
        }
  
        if (found) {
          resolve(found);
        } else {
          reject(new Error("Book not found"));
        }
      });
  
      return res.status(200).json(bookFound); 
    } catch (error) {
      return res.status(404).json({ message: error.message }); 
    }
  });
    
    
  // Task 12: Get book details based on Author using async-await
  public_users.get("/author/:author", async (req, res) => {
    const author = req.params.author.toLowerCase();
  
    try {    
      const filteredBooks = await new Promise((resolve, reject) => {
        const result = Object.values(books).filter(
          (book) => book.author.toLowerCase() === author
        );
        if (result.length > 0) {
          resolve(result);
        } else {
          reject(new Error("No books found by this author"));
        }
      });
  
      return res.status(200).json(filteredBooks); 
    } catch (error) {
      return res.status(404).json({ message: error.message }); 
    }
  });
    
  // Task 13: Get book details based on Title using async-await
  public_users.get("/title/:title", async (req, res) => {
    const title = req.params.title.toLowerCase();
  
    try {
      const filteredBooks = await new Promise((resolve, reject) => {
        const foundBooks = Object.values(books).filter(
          (book) => book.title.toLowerCase() === title
        );
  
        if (foundBooks.length > 0) {
          resolve(foundBooks); 
        } else {
          reject(new Error("No books found with this title"));
        }
      });
  
      return res.status(200).json(filteredBooks); 
    } catch (error) {
      return res.status(404).json({ message: error.message }); 
    }
  });

module.exports.general = public_users;
