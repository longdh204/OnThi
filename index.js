var express = require('express');
var router = express.Router();
// 1. câu lệnh kết nối mongoose
var mongoose = require('mongoose');
const mongoURL = 'mongodb+srv://longdh204:U5IPfR4zTmE3zlY5@exam.6ljz1.mongodb.net/testthi';
mongoose.connect(mongoURL,{useNewUrlParser:true,useUnifiedTopology: true}).then(()=>{
  console.log("Connected to mongodb successfully");
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const BookSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
});
const Book = mongoose.model('Book', BookSchema);

router.get('/listBooks', function(req, res, next) {
  Book.find({}).then((books)=>{
    res.json(books);
  });
});

// API thêm sách
router.post('/addBook', function(req, res, next) {
  var data = {
    errorCode: 200,
    message: "Successfully added"
  };
  const title = req.body.title;
  const price = req.body.price;
  const image = req.body.image;
  const newBooks = new Book({
    title: title,
    price: price,
    image: image,
  });
  newBooks.save().then(()=>{
    res.send(data);
  });
});

// API sửa sách (update)
router.put('/updateBook/:id', function(req, res, next) {
  const bookId = req.params.id;
  const updatedData = {
    title: req.body.title,
    price: req.body.price,
    image: req.body.image
  };

  Book.findByIdAndUpdate(bookId, updatedData, { new: true })
      .then((updatedBook) => {
        if (updatedBook) {
          res.json({ errorCode: 200, message: "Successfully updated", updatedBook });
        } else {
          res.status(404).json({ errorCode: 404, message: "Book not found" });
        }
      })
      .catch((error) => res.status(500).json({ errorCode: 500, message: error.message }));
});

// API xóa sách (delete)
router.delete('/deleteBook/:id', function(req, res, next) {
  const bookId = req.params.id;

  Book.findByIdAndDelete(bookId)
      .then((deletedBook) => {
        if (deletedBook) {
          res.json({ errorCode: 200, message: "Successfully deleted" });
        } else {
          res.status(404).json({ errorCode: 404, message: "Book not found" });
        }
      })
      .catch((error) => res.status(500).json({ errorCode: 500, message: error.message }));
});

module.exports = router;
