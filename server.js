const express = require('express');
const formidable = require('formidable');

const server = express();
server.use(express.static(__dirname+'/public'))


server.listen(7890,()=>{
    console.log('listening on localhost:7890')
})