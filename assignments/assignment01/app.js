let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let books = new Array();

app.get('/books/:bookId', (req, res) => {
	let bookId = req.params.bookId;
    console.log(books[bookId]);
    res.send(books[bookId]);
});

/*
 * json representation of book object
{
	"id" : 2,
	"name" : "book2",
	"price" : 2000,
	"author" : "jin"
}
*/
app.post('/books', (req, res) => {
	// Create book information
	books[req.body.id] = [req.body.id, req.body.name, req.body.price, req.body.author];
	res.send(books[req.body.id]);
})

app.put('/books', (req, res) => {
	// Update book information

})


app.delete('/books/:bookId', (req, res) => {
	// Delete book information

})
let server = app.listen(80);
	console.log(books);
