var express = require('express');
var morgan = require('morgan');
var path = require('path');

var articleOne={title:'Article one |Ravi varma',
    heading:'Article one',
    date:'Feb 14 2018',
    content:`<p> this is article one</p>
             <p>I am creating article one</p>`
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
            ${date}
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

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/article-one',function(req,res){
    res.send(createtemplate(articleOne));
});

app.get('/article-two',function(req,res){
    res.send('Article two is reqested and served here');
});
 
 app.get('/article-three',function(req,res){
    res.send('Article three is reqested and served here');
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
