//Thư viện
var express = require('express');
const async = require('hbs/lib/async')
const mongo = require('mongodb');
const { ObjectId } = require('mongodb')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true})) //this sentence is used in order to allow to read data from HTML elements 

//Database
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://GCH200087:gch200087@cluster0.tkcln.mongodb.net/?retryWrites=true&w=majority'

//Cổng
const PORT = process.env.PORT
app.listen(PORT)
console.log("Server is running" + PORT)
//////////////////////////////////////////////////////////////////////////////////////////////////

// Index page
app.get('/', (req,res) =>{
    res.render('home')
})

// Search
app.post('/search',async (req,res)=>{
    let name = req.body.txtName
    if(name = ''){
        res.render('search',{search_err: 'Please input after enter'})
    }
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNTOY")
    let products = await dbo.collection('TOY').find({$or:[{'name': new RegExp(name,'i')}]}).toArray() //Find here 
    res.render('AllProduct',{'products':products})
})

// Add new Product
app.get('/create',(req,res)=>{
    res.render('NewProduct')
})

app.post('/NewProduct',async (req,res)=>{
    let name = req.body.txtName 
    // if(name.length <= 0  ){ //validation
    //     res.render('NewProduct', {name_err: 'Please enter name'})
    // }
    let price =req.body.txtPrice
    // if(price < 1){
    //     res.render('NewProduct', {price_err: 'Please enter price'})
    // }
    let picURL = req.body.txtPicURL
    // if(picURL.length <= 0){
    //     res.render('NewProduct', {picURL_err: 'Please enter picture'})
    // }
    let description = req.body.txtDescription
    let amount = req.body.txtAmount
    // if(amount < 1){
    //     res.render('NewProduct', {amount_err: 'Please enter number of product'})
    // }

    let product = {
        'name':name,
        'price': price,
        'picURL':picURL,
        'description': description,
        'amount': amount
    }
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNTOY");
    if(name.length <= 0 || price < 1 || picURL.length <= 0 ||amount < 1 )
    { //validation
        res.render('NewProduct', {add_err: 'Please enter blank field'})
    } else {
        await dbo.collection("TOY").insertOne(product);
        if (product == null) {
            res.render('/')
        }
        res.redirect('/viewAll')
    }
    
})


// All product
app.get('/viewAll',async (req,res)=>{
    var page = req.query.page
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNTOY");
        let products = await dbo.collection("TOY").find().toArray()
        res.render('AllProduct',{'products':products})
    
})

//-----------------------------------------------------------------------




