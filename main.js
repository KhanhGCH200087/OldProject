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
const PORT = process.env.PORT || 8000
app.listen(PORT) 
console.log("Server is running " + PORT)
//////////////////////////////////////////////////////////////////////////////////////////////////

// Index page
app.get('/', (req,res) =>{
    res.render('home')
})

// Search
app.post('/search',async (req,res)=>{
    let name = req.body.txtName
    if(name.length <= 0){
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
    let price = parseFloat(req.body.txtPrice)
    let picURL = req.body.txtPicURL
    let description = req.body.txtDescription
    let amount = parseInt(req.body.txtAmount)

    let product = {
        'name':name,
        'price': price,
        'picURL':picURL,
        'description': description,
        'amount': amount
    }
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNTOY");
    if(name.length <= 0 || price <= 0 || picURL.length <= 0 || amount <= 0)
    { //validation
        res.render('NewProduct', {add_err: 'Please enter field again'})
    } else {
        await dbo.collection("TOY").insertOne(product);
        if (product == null) {
            res.render('/')
        }
        res.redirect('/viewAll')
    }
    
})

//----------------------------------------------------------------------------
// All product
app.get('/viewAll',async (req,res)=>{
    var page = req.query.page
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNTOY");
    let products = await dbo.collection("TOY").find().toArray()
    res.render('AllProduct',{'products':products})
    
})

//-----------------------------------------------------------------------




//Delete
app.get('/delete/:id', async (req,res)=>{
    const id = req.params.id
    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    var ObjectId = require('mongodb').ObjectId
    let condition = {"_id": new ObjectId(id)}
    await dbo.collection("TOY").deleteOne(condition)
    res.redirect("/viewAll")
})

//-------------------------------------------------------



//Sort
app.get('/sort_ascending_by_name', async (req,res)=>{
    var page = req.query.page
    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    var sort = {name: 1}
    let products = await dbo.collection("TOY").find().sort(sort).toArray()
    res.render('AllProduct', {'products': products})
})

app.get('/sort_descending_by_name', async (req,res)=>{
    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    var sort = {name: -1}
    let products = await dbo.collection("TOY").find().sort(sort).toArray()
    res.render('AllProduct', {'products': products})
})

app.get('/sort_ascending_by_price', async (req,res)=>{
    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    var sort = {price: 1}
    let products = await dbo.collection("TOY").find().sort(sort).toArray()
    res.render('AllProduct', {'products': products})
})

app.get('/sort_descending_by_price', async (req,res)=>{
    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    var sort = {price: -1}
    let products = await dbo.collection("TOY").find().sort(sort).toArray()
    res.render('AllProduct', {'products': products})
})

//-------------------------------------------------------------------------
//Update product
app.get('/update',async(req,res)=>{
    let id = req.query.id;
    const client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    let products = await dbo.collection("TOY").findOne({_id : ObjectId(id)})
    res.render('update', {'products': products})

})
app.post('/updateProduct', async(req,res)=>{
    let id = req.body._id;
    let name = req.body.txtName 
    let price = parseFloat(req.body.txtPrice)
    let picURL = req.body.txtPicURL
    let description = req.body.txtDescription
    let amount = parseInt(req.body.txtAmount)
    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    console.log(id)
    await dbo.collection("TOY").updateOne({_id: ObjectId(id)}, {
         $set: {
             'name': name,
             'price': price,
             'picURL': picURL,
             'description': description,
             'amount': amount
         }
    })
    res.redirect('/viewAll')
})