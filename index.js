if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid')
var { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
var name;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/authDemo';
// var check=[];
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('MONGO CONNECTED')
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!")
        console.log(err)
    });

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));
// app.use(express.static(__dirname + '/public/'));

app.use(express.static('public')); 
const secret = process.env.SECRET || 'microsoftengage';
// const store = new MongoDBStore({
//     url: dbUrl,
//     secret,
//     touchAfter: 24 * 60 * 60
// });
// store.on("error",function (e) {
//     console.log("Session store error",e)
// })

//telling express to pull the client script from the public folder
app.use(session({ 
    secret, 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl : dbUrl}),
}));

const requireLogin = (req, res, next) => {
    if(!req.session.user_id){
        return res.redirect('/')
    }
    next();
}

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.post('/signup', async (req,res) => {
    // res.send(req.body)
    const { password, username } = req.body;
    app.locals.name=req.body.username;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/secret')
    // res.send(hash);
    return name;
})

app.get('/' ,(req, res) => {
    res.render('login')
})
app.post('/' , async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    // const user = await User.findOne({username});
    // const validPassword = await bcrypt.compare(password, user.password);
    check=req.body.username;
    app.locals.name=req.body.username;
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret')
        // const user = document.getElementById('user');   //calling id #video-grid from room.ejs
        // document.getElementById("id").innerHTML = "Hello " + username;
        // console.log(user)
    }
    else{
        res.redirect('/')
    }
    // return check;
    return name,check;
})

app.post('/logout', (req,res) => {
    req.session.user_id = null;
    // req.session.destroy();
    res.redirect('/');
})

app.get('/secret', requireLogin ,  (req, res) => {
    // if (!req.session.user_id){
    //     return res.redirect('/login')
    // }
    // document.getElementById("id").innerHTML = "Hello " + req.body.username;
    // console.log('chekc',myVar);
    // console.log(username);
    res.render('secret')
})

app.use('/peerjs', peerServer);

//if they join the base link, generate a random uuid and send them to a new room with that uuid
app.get('/room', (req, res) => {
    
    res.redirect(`/${uuidV4()}`);
    // res.render('room')
    // res.status(200).send("Check done");
})



//if they join a specific room then render that room
app.get('/:room', requireLogin , (req, res) => {
  res.render('room', { roomId: req.params.room })
})


//someone connects to the server
io.on('connection', socket => {
//   console.log('chekc',check);
  

  //someone attempts to join the room
    socket.on('join-room', (roomId,userId) => {
        socket.join(roomId);  //join the room
        console.log('userid' +userId)
        socket.broadcast.to(roomId).emit('user-connected',userId); //tell everyone else in the room that we joined
    // messages
        socket.on('message', (message) => {
        //send message to the same room
            io.to(roomId).emit('createMessage', message, check,userId)
        });
     
    socket.on('disconnect', () => {
            console.log('disconnecting')
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
    })
});
})
const port = process.env.PORT || 3000  //run the server on port 3000
server.listen(port, () => {
    console.log(`SERVING YOUR APP in ${port}`)
})