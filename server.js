var express=require('express');
//console.log(express);
var app=express();
var cookieParser = require('cookie-parser');
var bodyParser=require('body-parser');
app.use(cookieParser()); // read cookies (needed for auth)
var methodOverride = require('method-override');
var db=require('./db/userOp');
var port =process.env.VCAP_APP_PORT||3000;
// connect to our mongoDB database 
//get all the data as json
app.use(bodyParser.json()); 
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 
app.get('/',function(req,res) {
	res.sendfile("./public/views/index.html");
	// body...
});
app.get('/slider.html',function(req,res){
	res.sendfile("./public/views/slider.html");
})
app.get('/fetchComments/:id',db.fetchComments);
app.get('/leaveComment/:score/:destination/:cdata',db.commentSubmit);
app.get('/fetchProject',db.fetchProjects);
app.get('/fetchSpecific/:Id',db.fetchSpecific);
app.get('/addNewProject/:pname/:email/:details/:address/:main/:sub',db.postData);
app.get('/likeIt/:Id',db.updateLike);
app.get('/putMoney/:amt/:Id',db.updateBWallet);
app.get('/show',db.show);
app.get('/donate/:Id',db.incr);
// set the static files location /public/img will be /img for dbs
app.use(express.static(__dirname + '/public'));
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);
                   
