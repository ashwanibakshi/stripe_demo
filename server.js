const e = require("express");
const express = require("express");
const stripe  = require("stripe")("sk_test_51K9WfSSI1lAYXJ13EHY37qzlZXmtowoSwMp1ISxg6vEx3WPiAlRMdvS9AQxexPagkzsHnDt8OeuS3mIfOui1K6TT005cVxBfGN");

const app = express();

const domainURL="http://localhost:4242"


app.use(express.json());

// app.post('/checkout',(req,res)=>{
//     stripe.paymentIntents.create({
//         amount: req.body.amt,
//         customer:req.body.email,
//         currency: 'inr',
//         payment_method_types: ['card']
        
//       },(err,data)=>{
//           if(err){
//               res.json({error:err.message});
//           }
//           else{
//               res.json({dataa:data});
//           }
//       });
// });

// app.post("/create-checkout-session", async (req, res) => {
//     // const domainURL = process.env.DOMAIN;
//     publicKey = "pk_test_51K9WfSSI1lAYXJ139AmuYXYUU4owTziKe6KiiCydW2HVlH0Uo0TBtPi1WxslJqAoZakQ7TpXLlNFWA4pZakXWNId00GTTlvhh4",
//     basicPlan = "price_1KCmITSI1lAYXJ13zAC34VJi",
//     proPlan =  "price_1KCmJ7SI1lAYXJ13JKGRLPSp"

//     // var stripee = require("stripe")(publicKey)

//     const planId  = proPlan;
  
//     // Create new Checkout Session for the order
//     // Other optional params include:
//     // [billing_address_collection] - to display billing address details on the page
//     // [customer] - if you have an existing Stripe Customer ID
//     // [customer_email] - lets you prefill the email input in the form
//     // For full details see https://stripe.com/docs/api/checkout/sessions/create
//     session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       subscription_data: { items: [{ plan: planId }] },
//       customer_email:"demo@d.com",
//       // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
//       success_url: `${domainURL}`,
//       cancel_url: `${domainURL}`,
//     });
//     // console.log(session)
//     res.send({
//       sessionId: session
//     });
//   });
  
app.post('/create-checkout-session', async (req, res) => {
        var publicKey = "pk_test_51K9WfSSI1lAYXJ139AmuYXYUU4owTziKe6KiiCydW2HVlH0Uo0TBtPi1WxslJqAoZakQ7TpXLlNFWA4pZakXWNId00GTTlvhh4";
        var basicPlan = "price_1KCmITSI1lAYXJ13zAC34VJi";
        var proPlan =  "prod_KsXNjb3P94x9GD";
          const planId  = proPlan;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
            //   customer_email:"demo@d.com",
              line_items: [
                {
                  price: basicPlan,
                  // For metered billing, do not pass quantity
                  quantity: 1,
          
                },
              ],
              customer:"cus_KuMKmV0P2YDnY1",
              mode: 'subscription',
      success_url: 'http://localhost:4242',
      cancel_url: 'http://localhost:4242',
    });
  
    res.send(303, session);
  });
  
  app.post('/create-portal-session', async (req, res) => {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.\
    console.log(req.body.sessionid.toString());
    const  session_id  = req.body.sessionid.toString();
    console.log("sfs",session_id)
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
  
    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = "http://localhost:3000/showdetails.html";
    console.log("customer",checkoutSession)
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer,
      return_url: returnUrl,
    });
  
    res.redirect(303, portalSession);
  });


app.listen(3000,()=>{console.log("server run at port "+3000)});