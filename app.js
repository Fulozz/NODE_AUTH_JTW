// Imporrts
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

// Config Json response
app.use(express.json());

// Models
const User = require('./models/User')


// Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem vindo a nossa API!" })
})

// Private Route

app.get('/user/:id', checkToken, async(req, res) => {
    const id = req.params.id

    //Check if user exist
    const user = await User.findById(id, '-password')

    if(!user){
        return res.status(404).json( {msg: "Usuario nao encontrado "})
    }

    res.status(200).json({ user })
})


function checkToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({ msg: "Acesso negado"})
    }

    try{
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        
        next()

    }catch(error){
        res.status(400).json({ msg: "Token invalido"})        
    }
}
// Register User
app.post('/auth/register', async(req, res) => {
    const {name, email, password, confirmPassword} = req.body
    
    // Validacoes
    if(!name){
        return res.status(422).json({msg: "O nome é obrigatório!" })
    }
    if(!email){
        return res.status(422).json({msg: "O email é obrigatório!" })
    }
    if(!password){
        return res.status(422).json({msg: "A senha é obrigatória!" })
    }

    if(password !== confirmPassword){
        return res.status(422).json({msg: "Senhas não conferem" })
    }

    // check if user exists

    const userExist = await User.findOne({ email: email })

    if(userExist){
        return res.status(422).json({msg: "Por favor, utilize outro email!" })
    }

    // Create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create User
    const user = new User({
        name,
        email,
        password: passwordHash,
    })
    try{
        await user.save()
        res.status(201).json({msg: "Usuario criado com sucesso"})
    } catch(error){
        console.log(error)
        res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"})
    }
})

// Login User
app.post("/auth/login", async(req, res)=>{
    const {email, password} = req.body

    // validacoes
    if(!email){
        return res.status(422).json({msg: "O email é obrigatório!" })
    }
    if(!password){
        return res.status(422).json({msg: "A senha é obrigatória!" })
    }

    const user = await User.findOne({ email: email })

    if(!user){
        return res.status(404).json({msg: "Usuario nao encontrado" })
    }

    // Check if password match
    const checkPassword  = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(422).json({msg: "Senha invalida, tente novamente!"})
    }

    try{
            const secret = process.env.secret

            const token = jwt.sign({
            id: user._id
            },
            secret,
        )

        res.status(200).json({msg: "Autenticacao realizada com sucesso", token})
    } catch(err){
        console.log(err)
        res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"})
    }

})


//credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

 mongoose
 .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.o5plwso.mongodb.net/?retryWrites=true&w=majority`,)
 .then(() => {app.listen(3000); console.log("Conectou ao banco!")})
 .catch((err)=> console.log(err));



// app.listen(3000)
