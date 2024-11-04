var express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const user = require('../models/user1-model');
var product = require('../models/product-model');
var router = express.Router();

dotenv.config();

                    //// USER CRUD OPERATIONS//

//................ SIGNUP - add-user-details ..................
router.post('/signup',async(req,res)=>{
  // try{
    //existing user check
    const exist=await user.findOne({email: req.body.email})
    if (exist){
      res.json({
        err: "already exists!!"
      })
      return
    }
    
    //create data
    const newdata = new user({
      email:req.body.email,
      password: req.body.password
    })
    newdata.save()

    // Then generate JWT Token
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    
    //sign data with token
    const token = jwt.sign(
      {id:newdata.id}, 
        jwtSecretKey,  
        { expiresIn: "1 hr" });
    
    //response
    res.status(201).json({
      success:true,
      _id: newdata.id,
      email: newdata.email,
      password: newdata.password,
      message: "Successfully registered",
      token: token
    });
    
  });

//.......................... user login .........................
  router.post('/login',async(req,res)=>{
  
    if(!req.body.email || !req.body.password){
      res.status(404).json({
        err: "Invalid input!!"
      })
      return
    }

    //existing user check
    const  exist=await user.findOne({email: req.body.email,password:req.body.password})
    if (!exist){
      res.json({
        err: "User is not Found!!"
      })
      return
    }
    
    // Then generate JWT Token
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    
    //sign data with token
    const token = jwt.sign(
      {id:exist.id}, 
      jwtSecretKey,  
      { expiresIn: "24 hr" }
    );

    //response
    res.status(201).json({
      success:true,
      message:"successfully logged in!!",
      token: token
    });

});

                /////   CART OPERATIONS ///////

//..................get products-data..........................
router.get('/get-all-products-data',async(req,res)=>{
  const allPdtData=await product.find({})
    if(allPdtData){
      res.status(200).json({
        res:"Product Details: "+allPdtData
      })
    }else{
      res.status(404).json({
        err:"false",
        message:"Resource not found."
      })
    }
    console.log("Product Details:"+allPdtData);
});

//.............,,,,,,get product-data by id.....................
router.get('/product/:id',async(req,res)=>{
  const PdtData=await product.findById({_id:req.params.id})
    if(PdtData){
      res.json({
        res:"Product details are: "+PdtData
      })
    }else{
      res.status(404).json({
        err:"false",
        message:"Resource not found."
      })
    }
    console.log("Product details are: "+PdtData);
});

//........................ add to cart ..............................
router.post('/addtocart', async(req,res)=>{

  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
  const decoded_user = jwt.verify(token, 'gfg_jwt_secret_key'); // Verify token
  if(!decoded_user){
    res.status(401).json({
      err:"false",
      message:"Missing / Invalid auth token."
    })
    return
  }
  // console.log(token);
  // console.log(decoded_user);
  // console.log("cart........."+req.body.cart);

  //update cart item to user on user_id
  const updatedPdtData=await user.findByIdAndUpdate( decoded_user.id, 
    {$push:{"cart":req.body.cart}},
    {new:true});
  
  // console.log(updatedPdtData);

  if(updatedPdtData){

    res.json({
      success:true,
      data:updatedPdtData,
      message:"successfully updated."
    })
  }else{
    res.json({
      success:false,
      message:"Couldn't update."
    })
  }
  //console.log("Updated product is: "+updatedPdtData);

});

//........................ Remove from Cart ......................
router.post('/removefromcart', async(req,res)=>{
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
  const decoded_user = jwt.verify(token, 'gfg_jwt_secret_key'); // Verify token

  if(!decoded_user){
    res.status(401).json({
      err:"false",
      message:"Missing / Invalid auth token."
    })
    return
  }

  console.log(decoded_user);

  // Delete cart item to user on user_id
  const deletedPdtData=await user.findByIdAndUpdate( decoded_user.id, 
    {$pull:{"cart":req.body.cart}});

  console.log(deletedPdtData);

  if(deletedPdtData){

    res.json({
      success:true,
      data:deletedPdtData,
      message:"successfully deleted."
    })
  }else{
    res.json({
      success:false,
      message:"Couldn't delete."
    })
  }
  // console.log("Deleted product is: "+updatedPdtData);

});


//..........................get User cart .......................
router.get('/getcart',async(req,res)=>{

  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
  const decoded_user = jwt.verify(token, 'gfg_jwt_secret_key'); // Verify token

  if(!decoded_user){
    res.status(401).json({
      err:"false",
      message:"Missing / Invalid auth token."
    })
    return
  }

  const user1 = await user.findOne({_id: req.body.id})//fetched from request body..
  // console.log(user);

  const response = {}

  if(user1){
    const cartItems = await user.aggregate([
      {
        $match: {_id: user1._id} //Match the user1 by ID
      },
      {
        $lookup: {
          from: 'product-details',
          let: {cart:user1.cart},
          pipeline:[
            {
              $match:{
                $expr:{
                  $in:["$_id",{
                    $map:{
                      input:"$$cart",
                      as:"cartId",
                      in:{$toObjectId: "$$cartId"}
                    }
                  }]
                }
              }
            }
          ],
          as: 'productDetails'
        }
      }
    ])
    console.log(cartItems);
  
    response.status = 200;
    response.ok = true;
    response.message= "Cart fetched successfully"
    console.log(response);
    res.json({
      res: cartItems
    })
  }
  
});

module.exports = router;