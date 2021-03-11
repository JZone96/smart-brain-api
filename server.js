/*
	/ --> this is working
	/signin --> POST the request of signing in, res => success/fail (USE POST, TO NOT INSERT THE PASSWORD IN A QUERY STRING)
	/register --> POST a new user => NEW USER
	/profile/:userId --> GET user info = USER
	/image --> PUT (update user profile) )= updater image counter
*/
const express = require ('express');
const bcrypt = require ('bcryptjs');
const cors = require('cors');
const knex = require ('knex');

const register = require ('./controllers/register');
const signin = require ('./controllers/signin');
const profile = require ('./controllers/profile');
const image = require ('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true,
  }
});

var corsOption = {
	origin: 'http://localhost:3001/',
	optionsSuccessStatus : 200
}

//(console.log(db.select('*').from('users'));//logs the builder object, integrarted in knex, that contains the query
//RETURNS A PROMISE. USE .THEN, NO NEED FOR JSON()


const app = express();

app.use (express.json());//parse the post input from frontend
app.use(cors());

app.get('/', (req,res)=>{
	res.json("page Loaded")
});

app.post ('/signin', (req,res)=> {signin.handleSignin(req, res, db, bcrypt)});

app.post ('/register', cors(corsOption), (req,res) => {register.handleRegister(req, res, db, bcrypt)});//dependencies injection

app.get ('/profile/:id', (req,res) => {profile.handleProfileGet(req,res,db)});

app.put('/image', (req,res)=> {image.handleImage(req,res,db)});

app.post('/imageurl', (req,res)=> {image.handleApiCall(req,res)})

app.listen (process.env.PORT || 3000, () =>{
	console.log (`App running on port ${process.env.PORT}`);
})