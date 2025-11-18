
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const DATA = path.join(__dirname, 'data', 'counter.json');
const LOG = path.join(__dirname, 'data', 'changes.log');

function log(line){
 fs.appendFileSync(LOG, new Date().toISOString()+' '+line+'\n');
}

app.get('/api/counter',(req,res)=> res.sendFile(DATA));

app.post('/api/update',(req,res)=>{
 let {action,value}=req.body;
 let counter=JSON.parse(fs.readFileSync(DATA,'utf8')).days;

 if(action==='inc') counter++;
 else if(action==='dec') counter--;
 else if(action==='set') counter=parseInt(value);

 fs.writeFileSync(DATA, JSON.stringify({days:counter},null,2));
 log(`UPDATE action=${action} value=${value}`);
 res.json({ok:true,days:counter});
});

app.get('/api/logs',(req,res)=> res.sendFile(LOG));

app.listen(10000,()=>console.log("Running on 10000"));
