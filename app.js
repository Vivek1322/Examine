//REQUIRING NPM PACKAGES
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    razorpay		= require("razorpay"),
    stripe			= require("stripe")("sk_test_PdVAcrsDy9xwLt12PhlBEnml00B8oaAVc2");



//INITIALIZING CONSTANTS
const PORT = process.env.PORT || 1000;


//BASIC CONFIGURATIONS
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));


//ROUTES
// app.get("/", function(req, res){
// 	res.render("home");
// });

// app.post("/checkout", function(req, res){
// 	(async () => {
// 		const charge = await stripe.charges.create({
// 	    	amount: 69900,
// 	    	currency: 'inr',
// 	    	source: req.body.stripeToken,
// 	  	});
// 	})();
// 	res.send(req.body);
// });

var instance = new razorpay({
	key_id: 'rzp_test_6gkeHKqbrpJ1OY',
	key_secret: 'JHJ3AQbLb9ognTbMSbv2i6oz'
});

app.get('/', function(req, res){
	res.render('razorpay');
});

app.get('/pay', function(req, res){
	var options = {
		amount: 5000,
		currency: "INR"
        };
	instance.orders.create(options, function(err, order){
		if(err){
			res.send(err);
        }
        else{
            console.log("**********Order Created***********");
            console.log(order);
            console.log("**********Order Created***********");
            res.render('pay', {orderId: order.id});
        }
	});
});


app.post('/purchase', (req,res) =>{
    payment_id =  req.body;
    console.log("**********Payment authorized***********");
    console.log(payment_id);
    console.log("**********Payment authorized***********");
    instance.payments.fetch(payment_id.razorpay_payment_id).then((response) => {
    console.log("**********Payment instance***********");
    console.log(response); 
    console.log("**********Payment instance***********")
    instance.payments.capture(payment_id.razorpay_payment_id, response.amount).then((response) => {
    console.log(response);
    res.redirect(`/success/?paymentId=${response.id}`);
}).catch((error) => {
  console.log(error);
});
}).catch((error) => {
  console.log(error);
});
});


// app.post('/payment', function(req, res){
//     payment_id = req.body;
//     if(payment_id.razorpay_payment_id){
//         //MAY BE SUCCESS
//         //CHECK FOR RAZORPAY_SIGNATURE
//         if(checkSignature(payment_id.razorpay_order_id, payment_id.razorpay_signature)){
//             instance.payments.fetch(payment_id.razorpay_payment_id, function(err, result){
//                 if(err){
//                     console.log(err);
//                     req.flash('error', 'Internal Server Error');
//                     res.redirect('/');
//                 }
//                 instance.payments.capture(payment_id.razorpay_payment_id, response.amount, function(err, result){
//                     if(err){
//                         console.log(err);
//                         req.flash('error', 'Internal Server Error');
//                         res.redirect('/');
//                     }
//                     res.redirect(`/success/?paymentId=${result.id}`);
//                 });
//             });
//         }
//         else{
//             req.flash('error', 'FRAUD!!!');
//             res.redirect('/');
//         }
//     }
//     else{
//         //FAILURE
//     }
// });




app.get('/success', function(req, res){
    res.send(req.query.paymentId);
});

app.post('/payment',(req,res)=>{
    console.log('inside callback url')
    return res.send('200',req.body);
});


//LISTEN ON PORT
app.listen(PORT, function(){
    console.log("Server has started!!!");
});