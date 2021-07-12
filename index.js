if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express'); //for creating express server
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose'); //odm library for mongodb and nodejs
const bcrypt = require('bcrypt'); //for hashing
const session = require('express-session'); //to stay  logged in
const MongoStore = require("connect-mongo");
const server = require('http').Server(app);
const io = require('socket.io')(server); //for real time communication - to manage communication between users 
const { v4: uuidV4 } = require('uuid')
var { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
var name,b;  
const uname={};
const dbUrl =  process.env.DB_URL || 'mongodb://localhost:27017/authDemo';
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('MONGO CONNECTED') //if connected to mongodb
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!") //if there was a problem connecting to mongodb
        console.log(err)
    });

app.set('view engine', 'ejs'); //tell Express we are using EJS
app.set('views', 'views');
app.use(express.urlencoded({extended: true})); //parses incoming requests with urlencoded payloads
app.use(express.static('public')); //tell express to pull the client script from the public folder
app.use('/peerjs', peerServer);
const secret = process.env.SECRET || 'microsoftengage';

app.use(session({ 
    secret, 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl : dbUrl}),
}));

const requireLogin = (req, res, next) => {
    if(!req.session.user_id){
        return res.redirect('/')  //if not logged in, redirect to login page
    }
    next(); //if logged in, do next step
}

app.get('/signup', (req, res) => {
    res.render('signup') //signup page is rendered
})

app.post('/signup', async (req,res) => {
    const { password, username } = req.body; 
    check=req.body.username; //setting check to username for the logged in user
    app.locals.name=req.body.username; //similarly, setting name = username
    const hash = await bcrypt.hash(password, 12);   //hash password, 12 number of salt rounds
    const user = new User({ 
        username,
        password: hash
    })
    await user.save(); //saving username and hashed password to db
    req.session.user_id = user._id;
    res.redirect('/secret') //redirecting to the main page
    return name,check;
})

app.get('/' ,(req, res) => {
    res.render('login') //rendering login page
})
app.post('/' , async (req, res) => { 
    const { username, password } = req.body;
    //validating the user
    const foundUser = await User.findAndValidate(username, password);
    check=req.body.username;
    app.locals.name=req.body.username;
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret') //redirecting to main page
    }
    else{
        res.redirect('/') //redirecting to login page
    }
    return name,check;
})

app.post('/logout', (req,res) => {
    req.session.user_id = null; //closing express session and logging out
    res.redirect('/'); //redirecting to login page
})

app.get('/secret', requireLogin ,  (req, res) => {
    res.render('secret') //rendering the main page (if logged in)
})

//if they join the base link, generate a random uuid and send them to a new room with that uuid
app.get('/room', (req, res) => {
    res.redirect(`/${uuidV4()}`);

})

//if they join a specific room then render that room
app.get('/:room', requireLogin , (req, res) => {
  res.render('room', { roomId: req.params.room })
})


//someone connects to the server
io.on('connection', socket => {
  //someone attempts to join the room
    socket.on('join-room', (roomId,userId) => {
        socket.join(roomId);  //join the room
    
        uname[userId]=check;
        socket.broadcast.to(roomId).emit('user-connected',userId); //tell everyone else in the room that we joined
    // messages
        socket.on('message', (message) => {
        //send message to the same room
            
            b=uname[userId]
            io.to(roomId).emit('createMessage', message,b)
        });
     
    //when someone leaves the room
    socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', uname[userId]);
    })
});
})
const port = process.env.PORT || 3000  //run the server on port 3000
server.listen(port, () => {
    console.log(`SERVING YOUR APP in ${port}`)
})