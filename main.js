var express = require('express');
const async = require('hbs/lib/async')
const mongo = require('mongodb');
const { ObjectId } = require('mongodb')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://GCH200087:gch200087@cluster0.tkcln.mongodb.net/?retryWrites=true&w=majority'
//var url = 'mongodb://leduchuy2207:leduchuy2002@ac-uijn7xw-shard-00-00.q7dpd26.mongodb.net:27017,ac-uijn7xw-shard-00-01.q7dpd26.mongodb.net:27017,ac-uijn7xw-shard-00-02.q7dpd26.mongodb.net:27017/test?replicaSet=atlas-hoj30z-shard-0&ssl=true&authSource=admin'

const PORT = process.env.PORT || 7000
app.listen(PORT)
console.log("Server is running")
//////////////////////////////////////////////////////////////////////////////////////////////////

// Index page
app.get('/', (req,res) =>{
    res.render('home')
})

// Search
app.post('/search',async (req,res)=>{
    let name = req.body.txtName

    let server = await MongoClient.connect(url)

    let dbo = server.db("ATNTOY")
   
    let products = await dbo.collection('TOY').find({$or:[{'name': new RegExp(name,'i')},
    {'price': new RegExp(name)}]}).toArray() 
    res.render('AllProduct',{'products':products})
})


// Add new Product
app.get('/create',(req,res)=>{
    res.render('NewProduct')
})

app.post('/NewProduct',async (req,res)=>{
    let name = req.body.txtName
    let price =req.body.txtPrice
    let picURL = req.body.txtPicture
    let description = req.body.txtDescription
    let amount = req.body.txtAmount
    let product = {
        'name':name,
        'price': price,
        'picURL':picURL,
        'description': description,
        'amount': amount
    }
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNTOY");
    await dbo.collection("TOY").insertOne(product);
    if (product == null) {
        res.render('/')
    }
    res.redirect('/viewAll')
    
})


// All product
app.get('/viewAll',async (req,res)=>{
    var page = req.query.page
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNTOY");
        let products = await dbo.collection("TOY").find().toArray()
        res.render('AllProduct',{'products':products})
    
})





