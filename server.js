let express=require("express");
let bodyParser=require("body-parser")
let app=express();
let path=require("path");
let port=3000;
let server=require("http").Server(app)
let io=require("socket.io")(server);
///////////////Middle Wares///////
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser)
app.set("views",path.join(__dirname,"views"))
////set veiw engine
app.set("view engine","ejs");
//////socket io //////////////
let users={};
io.on("connection",(socket)=>{
  console.log("connection");
  socket.on("new-user-join",(name)=>{
     users[socket.id]=name;
     socket.broadcast.emit("user-join",name)
  });
  
  socket.on("send",(message)=>{
    socket.broadcast.emit("receive",{message:message,name:users[socket.id]});
  })
  socket.on("disconnect",(message)=>{
    socket.broadcast.emit("left",users[socket.id]);
    delete users[socket.id];
  })
  
})


//////////routing//////////////

app.get("/",(req,res)=>{
  res.render("home");
  console.log(req.body.name);
  
});
app.post("/",(req,res)=>{
  console.log(req.body.name)
   res.render("chat");
})


server.listen(port);