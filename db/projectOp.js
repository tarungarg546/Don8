var mongoose=require('mongoose');
mongoose.connect('mongodb://angelhack:angelhack@ds033740.mongolab.com:33740/angelhack');
var dbproj=mongoose.connection;
var https=require('https');
var querystring=require('querystring');
var projectSchema=mongoose.Schema({
	projectName:String,
	creator:
	{
		type:String,
		default:'Admin'
	},
	details:String,
	address:String,
	email:String,
	genre:[{
		main:String,
		sub:String,
		household:{
			type:Boolean,
			default:false
		}
	}],
	time:{
		type:Date,
		default:Date.now
	},
	likes:{
		type:Number,
		default:0
	},
	comments:{
		type:Number,
		default:0
	},
	sentimentalValue:{
		type:Number,
		default:60
	},
	imageURI:[{
		img1:{
			type:String,
			default:null
		},
		img2:{
			type:String,
			default:null
		},
		img3:{
			type:String,
			default:null
		},
		img4:{
			type:String,
			default:null
		}
	}]
});
var projectFinale=mongoose.model('projectFinale',projectSchema);
dbproj.on('error',console.error.bind(console,"connection error"));
dbproj.once('open',function() {
	console.log("yo!");
	// body...
});
exports.fetchProjects=function(req,res){
	//console.log("fetching events info!");
	projectFinale.find().exec(function(err,result){
		if(err)
		{
			res.send(err);
		}
		else
		{
			//console.log("yes!");
			res.jsonp(result);
		}
	});
}
exports.postData=function(req,res){
	//console.log(req.params);
	var household=false;
	if(req.params.main=="cause")
		household=true;
	projectFinale.create({
		projectName:req.params.pname,
		email:req.params.email,
		details:req.params.details,
		address:req.params.address,
		genre:[{
			main:req.params.main,
			sub:req.params.sub,
			household:household
		}],
	},function(err,project){
		if(err)
			res.send(err);
		else
		{
			res.send(project);
		}

	});
}
exports.fetchSpecific=function(req,res){
	//console.log(req);
	projectFinale.findById(req.params.Id,function(err,result){
		if(err)
			res.send(err);
		else
			{
				//console.log("yes!");
				//console.log(result);
				res.jsonp(result);
			}
	});
}
exports.updateLike=function(req,res){
	var condition={_id:req.params.Id};
	projectFinale.findOne({ _id: req.params.Id }, function (err, doc){
		if(err)
			res.send(err);
  		doc.likes =doc.likes+1;
  		//doc.visits.$inc();
  		doc.sentimentalValue=Math.round((60+(0.4*doc.likes+0.6*doc.comments)/(doc.likes+doc.comments))*100)/100;
  		doc.save();
		res.send(doc);
	});
}
