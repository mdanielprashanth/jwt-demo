require('dotenv').config()

const express = require('express')
const app = new express()
const cors = require("cors");
const jwt = require('jsonwebtoken');

app.use(express.json())


// ✅ Allow frontend to access backend
app.use(cors({
    origin: "http://localhost:3000", // Allow only your frontend
    methods: "GET,POST", // Allowed methods
    allowedHeaders: "Content-Type,Authorization"
}));



const port = 8000;


const posts = [
{
        username: 'daniel',
        title: 'post 1'
    },
    {
        username: 'Kyle',
        title: 'post 2'
    }
]

app.get('/posts', authorize,  (req, res)=>{
    
    res.json(posts.filter(post => post.username === req.user.name));

})

app.post('/login', (req,res)=>{

    //Authenticate user 

    const username = req.body.username;
    const user = {name: username}

    const acessToken = jwt.sign(user, process.env.ACCESS_TOKEN)
    res.json({acessToken:acessToken})
})


function authorize(req, res, next) {
    const authorize = req.headers['authorization']
    const token = authorize && authorize.split(' ')[1]
    
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user)=>{
       if(err) return res.sendStatus(403)
       console.log(user);
    
       req.user = user;
       next()
    }) 
}

app.get('/', (req, res) => {
    res.send('Hello, Docker!');
});

app.listen(port, '0.0.0.0', ()=>{
    console.log(`Server running on port ${port}`);
    
})