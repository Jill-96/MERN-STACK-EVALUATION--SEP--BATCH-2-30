var express = require('express');
const multer = require('multer');
const user = require('../models/user1-model');
var product = require('../models/product-model');
var router = express.Router();

                        //PRODUCTS CRUD//

//...............add - products - data...........................
router.post('/add-product-data',async(req,res)=>{
  
    //existing user check
    const  exist=await product.findOne({name: req.body.name})
    if (exist){
      res.json({
        err: "already created.."
      })
      return
    }
  
    //create data
    const newdata = new product({
      name:req.body.name,
      price: req.body.price,
      quantity: req.body.quantity
    })
    
    newdata.save();
    res.json({
      res:"successfully created! Added product is: "+newdata
    })
    console.log("Added product is: "+newdata);
  
  });

//........................update products data....................
router.post('/update-product-data',async(req,res)=>{
  const updatedPdtData=await product.findByIdAndUpdate(
      {_id:req.body.id},
      {name:req.body.name},
      {price:req.body.price},
      {quantity:req.body.quantity}
    )
    if(updatedPdtData){
      res.json({
        res:"successfully updated. Updated product is: "+updatedPdtData
      })
    }
    console.log("Updated product is: "+updatedPdtData);
});

//................delete product-data.............................
router.post('/delete-product-data',async(req,res)=>{
  const deletedPdtData=await product.findByIdAndDelete(
      {_id:req.body.id}
    )
    if(deletedPdtData){
      res.json({
        res:"successfully deleted.  Deleted product is: "+deletedPdtData
      })
    }
    console.log("Deleted product is: "+deletedPdtData);
});

//...................upload product image.........................
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-' + file.originalname)
  }
})

const upload = multer({ storage })

router.post('/uploadimage',upload.single("image"),async(req,res)=>{
  if(req.file){
    console.log(req.file);
    res.json(
      {
        res:req.file
      }
    )
  }
  
});

//..................get products-data..........................
router.get('/get-all-products-data',async(req,res)=>{
  const allPdtData=await product.find({})
    if(allPdtData){
      res.status(200).json({
        res:"Product Details: "+allPdtData
      })
    }else{
      res.status(400).json({
        err:"false"
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
        err:"false"
      })
    }
    console.log("Product details are: "+PdtData);
});

module.exports = router;