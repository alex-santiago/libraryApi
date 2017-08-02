const env = require('dotenv').config()
const hapi = require('hapi')
const server = new hapi.Server();
const joi = require('joi')


// #################################
// hapi server and connection
// #################################

server.connection({
	host: (process.env.SERVER_HOST || "localhost"),
	port: Number(process.env.SEVER_PORT || 8080)
})


server.route(require('./routes'))

server.start(function () {

	console.log('server running at:', server.info.uri)


});

