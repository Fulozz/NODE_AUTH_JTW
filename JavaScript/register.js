// Imporrts
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

function concluirRegistro(e){
    e.preventDefault();
    var name = document.getElementById("name").value
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value
    var confirmPassword = document.getElementById("confirmPassword").value

return {name, email, password, confirmPassword}
}


export default {
    name: 'Register',
    data(){
        return{
            name: null,
            email: null,
            password: null,
            confirmPassword: null

        }
    },
    methods: {
        async getData(){ 
    
            // var name = document.getElementById("name").value;
            // var email = document.getElementById("email").value;
            // var password = document.getElementById("password").value;
            // var confirmPassword = document.getElementById("confirmPassword").value;
        
            const req = await fetch(`http://localhost:3000/auth/register`);
            const data = req.json()
        
            this.name = data.name;
            this.email = data.email;
            this.password = data.password;
            this.confirmPassword = data.confirmPassword
        },

    }
}
  
   



