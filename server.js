const express = require('express');
const formidable = require('formidable');
const path  = require('path')
const db = require('./db/mongodb.js');

const server = express();

server.use(express.static(__dirname+'/public'));
server.use('/bulma',express.static(path.join(__dirname,'node_modules/bulma/css/')))

server.post('/getNearestPoints',(req,res)=>{
    let form = new formidable.IncomingForm();
    form.parse(req,(err,fields,files)=>{
        if(err) return console.log('cannot parse req parameters :\n',err);
        console.log('params :',fields['point'],fields['distance'])
        db.getNearestPoints(fields['point'],fields['distance'],(err,results)=>{
            if(err) return console.log('error while getting nearest points :\n',err)
            res.send(results)
        })
    })
    
})
server.listen(7890,()=>{
    console.log('listening on localhost:7890')
})