var http = require("http")
var fs = require("fs")
var path = require('path')
var mime = require('mime')
var chatServer = require('./lib/chat_server')

var cache = {}

// socket.io server
chatServer.listen(server)

// 发送404错误页
function send404(response){
	response.writeHead(404,{"Content-Type":"text/plain"});
	response.write('Error 404:resource not found')
	response.end()
}

// 发送文件
function sendFile(response,filePath,fileContents){
	response.writeHead(200,{"Content-Type":mime.lookup(path.basename(filePath))});
	response.end(fileContents)
}

// 提供静态文件
function serveStatic(response,cache,absPath){
	// 检查文件是否在内存中
	if(cache[absPath]){
		sendFile(response,absPath,cache[absPath])
	}else{
		// 检查文件是否存在
		fs.exists(absPath,function(exists){
			if(exists){
				fs.readFile(absPath,function(err,data){
					if(err){
						send404(response)
					}else{
						cache[absPath]=data;  //放到内存中
						sendFile(response,absPath,data)
					}
				})
			}else{
				send404(response)
			}
		});
	}
}

// 创建http服务器
var server = http.createServer(function(req,res){
	var filePath = false;

	if(req.url == '/'){
		filePath = 'public/index.html'
	}else{
		filePath = 'public'+req.url
	}

	var absPath = './'+filePath;
	serveStatic(res,cache,absPath)
})

server.listen(3333,function(){
	console.log("Server listening on port 3333.")
})
