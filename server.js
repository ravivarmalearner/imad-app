var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto = require('crypto');
var bodyparser=require('body-parser');

var config={
    user:'bmravivarmapatchamatla',
    database:'bmravivarmapatchamatla',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};
var articles={
 'article-one':{
    title:'Article one |Ravi varma',
    heading:'Article one',
    date:'Feb 14 2018',
    content:`<p> this is article one</p>
             <p>I am creating article one</p>`
},
 'article-Two':{
    title:'Article Two |Ravi varma',
    heading:'Article Two',
    date:'Feb 17 2018',
    content:`<p> this is article Two</p>
             <p>I am creating article Two</p>`
},
 'article-Three':{
    title:'Article Three |Ravi varma',
    heading:'Article Three',
    date:'Feb 17 2018',
    content:`<p> this is article Three</p>
             <p>I am creating article Three</p>`
},
};

function createtemplate(data){
var title=data.title;
var heading=data.heading;
var date=data.date;
var content=data.content;
var htmltemplate=`
<html>
    <head>
        <title>
           ${title} 
        </title>
    </head>
    <body>
        <div>
            <a href="/">Home</a>
        </div>
        <hr/>
        <h3>
            ${heading}
        </h3>
        <div>
            ${date.toDateString()}
        </div>
        <div>
            <p>
               ${content}
            </p>
        </div>
    </body>
</html>`;
return htmltemplate;
    
}
var app = express();
app.use(morgan('combined'));
app.use(bodyparser.json());
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt){
    //how do we create hash
    var hashed=crypto.pbkdf2Sync(input, salt, 100000, 512, 'sha512');
   return  ["pbkdf2","10000",salt,hashed.toString('hex')].join('$'); 

}

app.get('/hash/:input',function(req,res){
    var hashedstring=hash(req.params.input,'this is some string');
    res.send(hashedString);
});

app.post('/create-user',function(req,res){
   var username=req.body.username;
   var password=req.body.password;
    var salt=crypto.randomBytes(128).toString('hex');
    var dbstring = hash(password,salt);
    pool.query('INSERT INTO "users"(username,password) VALUES ($1,$2)',[username,dbstring],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
        res.send ('user succesfully created'+username);   
        }
        
    });
});

app.post('/login',function(req,result){
     var username=req.body.username;
     var password=req.body.password;
    var dbstring = hash(password,salt);
    pool.query('SELECT * FROM  "users" where username=$1',[username],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length===0){
                res.send(403).send('username/password is invalid');
            } else {
        //Match the password
        var dbstring=result.rows[0].password;
        var salt=dbstring.split('$')[2];
        var hashedpassword=hash(password,salt);
        if(hashedpassword===dbstring){
            res.send('credential corrct');
        }else{
           res.send(403).send('username/password is invalid');   
                }
            }
        }
        
    });
    
});

var pool = new Pool(config);

app.get('/test-db1',function(req,res){
    pool.query('select * from test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
        res.send (JSON.stringify(result.rows));   
        }
    });
    
});


var counter=0;
app.get('/counter', function (req, res) {
  counter=counter+1;
  res.send(counter.toString());
});
var names=[];
app.get('/name-req/:name',function(req,res){
    
    var name=req.params.name;
    names.push(name);
    res.send(JSON.stringify(names));
});
app.get('/articles/:articleName',function(req,res){
  
  var articleName = req.params.articleName;
  pool.query("SELECT * from articles WHERE title='"+articleName+"'",function(err,result){
      if(err){
          res.status(500).send(err.toString());
      } else{
          if(result.rows.length === 0) {
              res.status(404).send("article not found");
          } else {
              var articleData= result.rows[0];
               res.send(createtemplate(articleData))
          }
      }
   });
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});



app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});




// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
