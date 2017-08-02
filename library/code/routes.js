const models = require('./models')
const joi = require('joi')

// #################################
// validation schema
// #################################

const bookSchema = {
    _id : joi.string().required(),
    title : joi.string().required(),
    author : joi.string().required(),
    genre : joi.string().required(), 
    publication : {
      year : joi.number().min(1),
      month : joi.number().min(1).max(12),
      publisher : joi.string().required()
    },
    copies : joi.number().min(1).required(),
    availability : joi.number(),
    blocked : joi.number(),
  }


// #################################
// routes
// #################################

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      return reply('this is a library api to lend books')
    }
  },
  {
    method: 'GET',
    path: '/books',
    handler: async (request, reply) => {
      models.book.findAll(request.query, function(err, books) {
        if (books.length > 0) {
          reply(books).code(200)
        } else {
          reply('no books were found').code(404)          
        }
      })
    }
  },
  {
    method: 'GET',
    path: '/books/{_id}',
    handler: (request, reply) => {
      models.book.findBook(request.params._id, function(err, books) {
      if (books.length === 0) {
        reply('no book by that id found').code(404)
      }
      else {
        reply(books[0])
      }

      })
    }
  },
  {
    method: 'POST',
    path: '/books',
    config: {
      validate: {
        payload: bookSchema
      }
    },
    handler: (request, reply) => {
      models.book.saveBook (request.payload, function(err, books) {
        console.log(books)
        if (err) {
          console.log(err)
          reply('Error saving book').code(501)
        }
        else {
          reply('book saved').code(200)
        }
      })
    }    
  },
  {
    method: 'DELETE',
    path: '/books/{_id}',
    handler: (request, reply) => {
      models.book.findBook (request.params._id, function(err, books) {
        if (books.length === 0) {
          reply('no book by that id found').code(404)
        }
        else {
          models.book.deleteBook (request.params._id, function(err) {
          if (err) {
            console.log(err)
            reply('Error deleting book').code(502)
          } 
          else {
            reply('book removed').code(200)
          } 
          } )
        }
      } )
    }
  },
  {
    method: 'PUT',
    path: '/books/{_id}',
    config: {
      validate: {
        payload: bookSchema
      }
    },
    handler: (request, reply) => {
      models.book.findBook (request.params._id, function(err, books) {
      if (books.length === 0) {
        reply ('no book by that id found').code(404)
      }
      else {
        models.book.updateBook (request.params._id, request.payload, function(err, books) {
          if (err) {
            console.log(err)
            reply('Error updating book').code(503)
          }
          else {
            reply('book updated').code(200)
          }
        })
      }
      } )
    }
  },
  {
    method: 'GET',
    path: '/books/{p*}',
    handler: queryName
  }
]

async function queryName (request, reply) {
  if (request.query.name) {
    let student = await books.find({name: request.query.name})
    if (Object.keys(student).length !== 0) {
      return reply(student)
    }
    return reply ('no student by that name').code(404)
  }
  return reply ('query not recognized. try searching by name').code(404)
}