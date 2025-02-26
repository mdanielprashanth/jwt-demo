require('dotenv').config()

const express = require('express')
const app = new express()
const jwt = require('jsonwebtoken');


app.use(express.json())

const port = 9000;

let refreshTokens = [];

app.post('/token', (req, res)=>{  

    const refreshToken = req.body.token;
    if (refreshToken === null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user)=>{
        if(err) return res.sendStatus(403)
        const acessToken = generateToken({name : user.name})    
        res.json({acessToken:acessToken})
    })


})

app.post('/login', (req,res)=>{

    //Authenticate user 

    const username = req.body.username;
    const user = {name: username}

    const acessToken = generateToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN)
    refreshTokens.push(refreshToken)
    res.json({acessToken:acessToken, refreshToken:refreshToken})
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


app.delete('/logout', (req, res)=>{
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
    res.sendStatus(204)
})

function generateToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn:'30s'})
}

app.get('/', (req, res) => {
    res.send('Hello, Docker!');
});

app.listen(port, '0.0.0.0', ()=>{
    console.log(`Server running on port ${port}`);
})