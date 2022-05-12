let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let books = new Array();

app.get('/books/:bookId', (req, res) => {
	if(!books[req.params.bookId]) {
		res.send('The bookID was not found.')
		return;
	}
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
	if(books[req.params.bookId]) {
		res.send('The book information was created before.')
		return;
	}
	books[req.body.id] = [req.body.id, req.body.name, req.body.price, req.body.author];
	res.send(books[req.body.id]);
})

app.put('/books/:bookId', (req, res) => {
	// Update book information
	if(!books[req.params.bookId]) {
		res.status(404).send('The bookID was not found.');
		return;
	}
	if(req.params.bookId != req.body.id) {
		res.send('BookId from parameter is different with BookId from body.');
		return;
	}
	books[req.params.bookId] = [req.body.id, req.body.name, req.body.price, req.body.author];
	res.send(books[req.body.id]);
})


app.delete('/books/:bookId', (req, res) => {
	// Delete book information
	if(!books[req.params.bookId]) {
		res.status(404).send('The bookID was not found.');
		return;
	}
	books.splice(req.params.bookId, 1);
	res.send('Delete Success.')
})
let server = app.listen(80);
	console.log(books);
