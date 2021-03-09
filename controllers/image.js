const Clarifai = require ('clarifai');

const app = new Clarifai.App({
  apiKey : 'f9e837ab0386499e9583b19c25f83b74'
});

const handleApiCall = (req,res) =>{
	app.models.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
	.then(data => {
		res.json(data);
	}).catch(err => res.status(400).json('unable to call API'))
}

const handleImage = (req,res, db)=>{
	const {id} = req.body;
	db('users')
	.where('id', '=', id)
	.increment ('entries', 1)
	.returning('entries')//NEED THIS, OTHERWISE IT WOULD RETURN THE INCREMENT, NOT THE INCREMENTED VALUE
	.then (entries=>{
		res.json(entries[0]);
	}).catch(err => res.json(`can't update entries`));
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}