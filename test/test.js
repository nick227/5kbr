/*jslint node: true */
/*global describe: false, before: false, after: false, it: false */

"use strict";
var expect = require('chai').expect,
	request = require('request'),
	server = require('../server'),
	redis = require('redis'),
	io = require('socket.io-client'),
	client,url;
url = 'http://localhost:5000/';
client = redis.createClient();

// Server tasks
describe('server', function(){

	before(function(done){
		console.log("STARTING SERVER");
		done();
	});

	after(function(done){
		console.log("STOPPING");
		client.flushdb();
		done();
	});

});

//route index
describe('index route', function(){
	it('Requests http://localhost:5000/', function(done){
		request.get({url:url}, function(e,response, body){
			expect(body).to.include('CHATYAK');	
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
			done();
		});
		
	});
});


//Message Handling
describe('Socket test \n ==============', function(){
	
	it("should respond 'okay'", function(done){
		//hello websocket
		var socket = io.connect(url, {
                'reconnection delay' : 0,
                'reopen delay' : 0,
                'force new connection' : true
		});
		//Handle message
		socket.on('message', function(data){
			console.log("ding!");
			expect(data).to.include('okay');
			socket.disconnect();
			done();
		});
		//send msg
		console.log("emitting....");
		socket.emit('send', {message:'okay'});
	});
});

