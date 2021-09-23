const express = require('express');
const app = express();
const port = 4000;
var server = require('http').createServer(app);

app.get('/',(req,res)=>{
    res.send("Chat app..")
})

var io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {

    var time = new Date().toISOString();
    console.log(`+ Client connected      |   Client Id: ${socket.id} |   DateTime: ${time}`);

    socket.on('disconnect', reason => {
        var time = new Date().toISOString();
        console.log(`- Client disconnected   |   Client Id: ${socket.id} |   DateTime: ${time}`);
    });
    
    socket.on('join_room', (data) =>{
        socket.join(data);
        console.log(`User joined room: ${data}`);
    });

    socket.on('send_message', (data) =>{
        console.log(data);
        socket.to(data.room).emit("receive_message", data.content);
    });

});


server.listen(port, () => {
    console.log(`Socket.IO server listening at http://localhost:${port}`) //External port determined after deployment to azure app service.
});
