const db = require('mongoose')

// #################################
// database server and connection
// #################################

	db.connect(process.env.DBURL)

	var conn = db.connection

	conn.on('error', console.error.bind(console, 'connection error:'));
	conn.once('open', function() {
		// console.log('db logged on', process.env.DBURL)
		console.log('db logged on')
		// conn.close()
	});

	conn.once('close', function() {
		console.log('connection closed')
	})


	let bookSchema = db.Schema({
		_id : String,
		title : String,
		author : String,
		genre : String, 
		publication : {
			year : Number,
			month : Number,
			publisher : String
		},
		copies : Number,
		availability : Number,
		blocked : Number,
		reservations : [{
			_id : Number,
			user : String,
			reserve_date : Date,
			max_date : Date
			}],
		borrows : [{
			_id : Number,
			user : String,
			borrow_date : Date,
			due_date : Date
			}]
	})

	let bookModel = conn.model('Books', bookSchema, "Books")

	function findAll(query, callback) {
	    if (Object.keys(query).length === 0) {
	      bookModel.find(function(err,books) {
	        callback(err,books)
	      })
	    } else {
	      if (query.genre) {
	       let book = bookModel.find({genre:query.genre}, function(err, books) {
	         callback(err, books)
	       })
	     } else if (query.title) { 
	       let book = bookModel.find({title:{$regex:query.title, $options:"$i"}}, function(err, books) {
	         callback(err, books)
	       })
	     } else if (query.author) {
	       let book = bookModel.find({author:{$regex:query.author, $options:"$i"}}, function(err, books) {
	         callback(err, books)
	       })
	     } else {
	       callback(err, nil)
	     }
	   }
	}

	function findBook(id, callback) {
		bookModel.find({_id: id}, function(err, books) {
			callback(err, books)
		})
	}

	function saveBook(book, callback) {
		var newbook = new bookModel(book)
		newbook.availability = Number(newbook.copies)
		newbook.blocked = 0

		newbook.save(function(err) {
			callback(err)
		})
	}

	function deleteBook(id, callback) {
		bookModel.findByIdAndRemove ({_id: id}, function(err) {
			callback(err)
		})
	}

	function updateBook(id, book, callback) {
		console.log(id)
		console.log(book)
		bookModel.findByIdAndUpdate({_id: id}, book,function(err) {
			callback(err)
		})
	}

	module.exports.book = {
		findAll: findAll,
		findBook: findBook,
		saveBook: saveBook,
		updateBook: updateBook,
		deleteBook: deleteBook
	}







