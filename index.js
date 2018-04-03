var express = require('express');
var app = express();
var bodyParser = require('body-Parser');
var mongoose = require('mongoose');
var router = express.Router(); // Invoke the Express Router
var morgan = require('morgan'); // Import Morgan Package
var Users = require('./models/user');
var Drive = require('./models/drive');
var Genre = require('./models/genre');
var Book = require('./models/book');
var Uber = require('node-uber');

mongoose.connect('mongodb://localhost:27017/cars', function(err){
  if(err){
    console.log('database not connected' +err);
    throw err;
  }
  else{
    console.log('database connected');
  }
});
var db =  mongoose.connection;

var options = {
  sandbox: true,
  client_id: 'un81qt5z-8T8MMtvv_fZUiSLGdzpX5Ss',
  client_secret: 'u4htZMSmIpqjphfpoA8baH4ol-v3FJHRehEz_68w',
  server_token: 'a5My_3bOOscgixm_fLfiTUa0aMxXPTuQV8puyu7F',
  redirect_uri: 'http://localhost:3000/callback',
  name: 'manish',

}

app.use(morgan('dev')); // Morgan Middleware
app.use(bodyParser.json());
//app.use(bodyParser.raw({ contentType: 'application/json' }));

app.use(express.static('public'));
app.set('views', './views');


var uber = new Uber(options);

app.get('/', function(req, res) {
  console.log(__dirname + 'views/index.html');
    res.sendFile(path.join(__dirname + '/index.html')); // Set index.html as layout


  // Kick off the authentication process
 // var scope = ['request'];
 //  res.redirect(uber.getAuthorizeUrl(scope, 'http://localhost:3000/callback'));
});

//AWS ALEXA VOICE START

app.get('/testing', function( req ,res){
  var myObj = { "dogPicture":"" };
  console.log("requested")
  res.send(myObj);
});

// ALEXA VOICE TEST END

app.get('/callback', function (req, res) {
  uber.authorization ({grantType: 'authorization_code', authorization_code: req.query.code}, function (err, access_token) {
    // Now we've got an access token we can use to book rides.
    // Access tokens expires in 30 days at whichpoint you can refresh.
    // You should save this token
    // More info: https://developer.uber.com/docs/authentication
    uber.access_token = access_token;
    res.send('Got an access token! Head to /book to initiate an ride request.');
  });
});
// registration code is here
app.post('/userregistration', function(req,res){
  console.log(req.body);
  var user = new Users();
  user.firstname = req.body.firstname; 
   user.lastname = req.body.lastname; 
  user.phone = req.body.phone; 
  user.email = req.body.email;
  user.password = req.body.password;
  console.log(req.body.firstname);


  if(req.body.firstname ==null || req.body.firstname ==""){
    res.json({success:false, message:'Firstname should be provide!'})
  }
  else if(req.body.lastname ==null || req.body.lastname ==""){
    res.json({success:false, message:'lastname should be provide!'})      
  }
  else if(req.body.phone ==null || req.body.phone ==""){
    res.json({success:false, message:'phone should be provide!'})            
  }
  else if(req.body.password ==null || req.body.password ==""){
    res.json({success:false, message:'password should be provide!'})                  
  }
  else if(req.body.email ==null || req.body.email ==""){
    res.json({success:false, message:'Username or Email should be provide!'})
  }
  else{
    user.save(function(err) {
      if(err) {
        console.log(err);
        res.json({success:false, message:'email already exist'});
      }
      else{
        res.json({success:true, message:'success user created'});     
      }
    });   

  }
});

/// registration code end here

app.get('/product', function( req ,res){
  console.log("pr");
  res.sendFile(__dirname + '/registration.html');
});

app.get('/api/estimates/address', function(request, response) {
  // extract the query from the request URL
  console.log(request.query.start);
  uber.estimates.getPriceForRouteByAddressAsync(
    request.query.start,
    request.query.end)
  .then(function(res) {
   console.log(res); 
   response.send(res);
 })
  .error(function(err) { console.error(err);  
  });
});

app.get('/api/estimates/route', function(request, response) {
  // extract the query from the request URL
  uber.estimates.getPriceForRouteAsync(3.1357169, 101.6881501, 3.0833, 101.6500)
  .then(function(res) { 
    response.send(res);
    console.log(res); 
  })
  .error(function(err) { console.error(err); });
});

app.get('/api/estimates/location', function(request, response) {
  // extract the query from the request URL
  uber.estimates.getETAForAddressAsync('455 Market St, San Francisco, CA 94103, US')
  .then(function(res) { 
    response.send(res);
    console.log(res); 
  })
  .error(function(err) { console.error(err); });

});

app.get('/api/products', function(request, response) {
  // extract the query from the request URL
  uber.products.getAllForAddressAsync('1455 Market St, San Francisco, CA 94103, US')
  .then(function(res) {
   response.send(res); 
   console.log(res); 
 })
  .error(function(err) { console.error(err); });
});

app.get('/api/products/location', function(request, response) {
  // extract the query from the request URL
  uber.products.getAllForLocationAsync(3.1357169, 101.6881501)
  .then(function(res) {
   response.send(res);  
   console.log(res);
 })
  .error(function(err) { console.error(err); });
});

app.get('/api/product/id', function(request, response) {
  // extract the query from the request URL
  uber.products.getByIDAsync('d4abaae7-f4d6-4152-91cc-77523e8165a4')
  .then(function(res) { 
    response.send(res);
    console.log(res);
  })
  .error(function(err) { console.error(err); });

});



app.listen(3000, function () {
  console.log('Listening on port 3000!');
});