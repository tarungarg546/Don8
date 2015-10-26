var mongoose=require('mongoose');
var keys=require('./../keys/keys.json');
mongoose.connect(keys.mongoose.url);
var db=mongoose.connection;
var dbproj=mongoose.connection;
var comm=mongoose.connection;
var https=require('https');
var querystring=require('querystring');
var commentSchema=mongoose.Schema({
	creator:
	{
		type:String,
		default:'Admin'
	},
	commentData:
	{
		type:String,
		default:null
	},
	date:{
		type:Date,
		default:Date.now
	},
	commentSentiment:{
		type:Number
	},
	destination:{
		type:String,
		default:null
	}

});
var user=mongoose.Schema({
	name:
	{
		type:String,
		default:'Admin'
	},
	projectsNo:{
		type:Number,
		default:0
	},
	asContributor:
	{
		payment_info:[{
			date:{
				type:Date,
				default:Date.now
			},
			id:String
		}],
		paymentThisMonth:Number,
		contactInfo:
		{
			address:String,
			phoneNo:Number,
			email:String,
			facebookId:{
				type:String,
				default:null
			}
		}
	},
	asBeneficiar:
	{
		date:{
			type:Date,
			default:Date.now
		},
		projectDetail:[{
			id:{
				type:String
			},
			noPerson:{
				type:Number,
				default:0
			}
		}],
		amountEarned:Number,
		contactInfo:
		{
			address:String,
			phoneNo:Number,
			email:String,
		}

	}
});
var userFinale=mongoose.model('userFinale',user);
db.on('error',console.error.bind(console,"connection error"));
db.on('open',function(){
	console.log('Yo Yo!');
	/*userFinale.find().exec(function(error,results){
		if(results.length<=3)
		{
			userFinale.create({
				asContributor:{
					payment_info:[{id:'55861be4792d657422d2f187'}],
					paymentThisMonth:50,
					contactInfo:{phoneNo:980,email:'tarun@gmail.com'}
				},
				asBeneficiar:{
					projectDetail:[{id:'55861be4792d657422d2f187'},{id:'55861e09242d22381de1b407'}],
					amountEarned:0,
					contactInfo:
					{phoneNo:980,email:'tarun@gmail.com',address:'random'}
				}
			});
		}
	});*/
});
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
var comment=mongoose.model('comment',commentSchema);
comm.on('error',console.error.bind(console,"connection error"));
comm.once('open',function() {
	console.log("yo! yo! yo!");
	// body...
});
var projectFinale=mongoose.model('projectFinale',projectSchema);
dbproj.on('error',console.error.bind(console,"connection error"));
dbproj.once('open',function() {
	console.log("yo!");
	// body...
});
exports.fetchComments=function(req,res){
	//console.log(req.params.id);
	comment.find({destination:req.params.id},function(err,doc){
		if(err)
			res.send(err);
		else
		{
			console.log(doc);
			res.send(doc);
		}
	});
}
exports.commentSubmit=function(req,res){
	console.log(req.params.score);
	comment.create({
		commentSentiment:req.params.score,
		destination:req.params.destination,
		commentData:req.params.cdata
	},function(err,project){
		if(err)
		{
			res.send(err);
		}
		else
		{
			projectFinale.findById(req.params.destination,function(err,result){
				console.log(result.sentimentalValue);
				console.log(parseFloat(req.params.score)+parseFloat(result.sentimentalValue));
				result.sentimentalValue=Math.round((parseFloat(result.sentimentalValue)+parseFloat(req.params.score))*100)/100;
				console.log(result.sentimentalValue);
				result.save();
				res.send(result);
			});
		}
	});

}
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

//console.log(proj);

exports.show=function(req,res){
	userFinale.find().exec(function(err,result){
		if(err)
		{
			res.send(err);
		}
		else
		{
			res.jsonp(result);
		}
	});
};
exports.incr=function(req,res){
		userFinale.find().exec(function(err,result){
		if(err)
		{
			res.send(err);
		}
		else
		{
			result[0].projectsNo=result[0].projectsNo+1;	
			var obj={};
			obj.id=req.params.Id;
			var length=result[0].asContributor.payment_info.length;
			result[0].asContributor.payment_info.push(obj);
			result[0].save();
			projectFinale.findById(req.params.Id).exec(function(err,result){
				if(err)
					res.send(err);
				else
				{
					userFinale.findOne({name:result.creator}).exec(function(err,parinaam){
						if(err)
								res.send(err);
						else
						{
							var length=parinaam.asBeneficiar.projectDetail.length;
							for(var i =0;i<length;i++)
							{
								if(parinaam.asBeneficiar.projectDetail[i].id==req.params.Id)
								{
									console.log(parinaam.asBeneficiar.projectDetail[i]);
									parinaam.asBeneficiar.projectDetail[i].noPerson=parinaam.asBeneficiar.projectDetail[i].noPerson+1;
									parinaam.save();
									console.log(parinaam.asBeneficiar.projectDetail[i]);
									break;
								}
							}
							res.send(parinaam);
						}
					})
				}
			});
		}
	});
}
exports.updateBWallet=function(req,res){
	//console.log(req.params.amt);
	var cond={_id:req.params.id};
	userFinale.findOne({_id:req.params.id},function(err,doc){
		if(err)
		{
			res.send(err);
		}
		else
		{
			doc.projectsNo=0;
			doc.asContributor.payment_info=[];
			doc.asContributor.paymentThisMonth=req.params.amt;
			doc.save();
			res.send(doc);
		}
	});
}