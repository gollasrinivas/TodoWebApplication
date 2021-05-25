let express = require("express")
let ourApp =express()
let mongodb=require("mongodb")
let sanitizeHTML = require("sanitize-html")
let db
let port= process.env.PORT
if(port==null || port==""){
  port=3000
}
ourApp.use(express.static('public'))
ourApp.use(express.json())
ourApp.use(express.urlencoded({extended:false}))

connString='mongodb+srv://gsrinivas4:0srinivas@web-demo-9oyf0.mongodb.net/todo?retryWrites=true&w=majority'
mongodb.connect(connString,{useUnifiedTopology: true },(err,client)=>{
db=client.db()
ourApp.listen(port)
})

ourApp.get('/',(req,res)=>{
db.collection('todo-items').find().toArray(function(err,items){
res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Srinivas To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">srinivas To-Do App</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form id="myForm" action="/create-item" method="POST">
        <div class="d-flex align-items-center">
          <input id="input-item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;" name="item">
          <button name="insert" class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul id="list-items" class="list-group pb-5"> 
    </ul>
    
  </div>
  
</body>
<script> let items=${JSON.stringify(items)}   </script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="browser.js"></script>
</html>
`)
})
})
ourApp.post('/create-item',(req,res)=>{
  let freshText=sanitizeHTML(req.body.text,{allowedTags:[],allowedAttributes:{}})
    db.collection('todo-items').insertOne({"item":freshText},(err,info)=>{
        res.json(info.ops[0])
         
    })
  })
ourApp.post('/update-item',function(req,res){
  let freshText=sanitizeHTML(req.body.text,{allowedTags:[],allowedAttributes:{}})
  db.collection('todo-items').findOneAndUpdate({_id:new mongodb.ObjectId(req.body.id)},{$set:{"item":freshText}},()=>{
    res.send("success")
  })
})
ourApp.post('/delete-item',(req,res)=>{
  db.collection("todo-items").deleteOne({_id:new mongodb.ObjectId(req.body.id)},()=>{
    res.send("success")
  })
})


