const e = require("express");
const express = require("express");
const stripe  = require("stripe")("");

const app = express();

app.use(express.json());

app.post('/checkout',(req,res)=>{
    stripe.paymentIntents.create({
        amount: req.body.amt,
        customer:req.body.email,
        currency: 'inr',
        payment_method_types: ['card']
        
      },(err,data)=>{
          if(err){
              res.json({error:err.message});
          }
          else{
              res.json({dataa:data});
          }
      });
});

app.listen(3000,()=>{console.log("server run at port "+3000)});