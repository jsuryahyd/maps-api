const express = require('express');
const formidable = require('formidable');
const path  = require('path')
const server = express();
server.use(express.static(__dirname+'/public'));
server.use('/bulma',express.static(path.join(__dirname,'node_modules/bulma/css/')))


server.listen(7890,()=>{
    console.log('listening on localhost:7890')
})