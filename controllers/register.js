
const handleRegister=(req, res, db, bcrypt)=>{
	const {name, email, password} = req.body;
	if (!email || !name || !password){
		return res.status(400).json('incorrect form submission');
	}
	bcrypt.hash(password, 8, function(err, hash) {
		if (err){
			res.status(400).json("Error hashing pwd");
		}else{
			db.transaction(trx =>{//transaction: to fill two tables with the same foreign key
				//if anything in a table fails, all the task fail
				trx.insert({
					hash: hash,
					email: email,
				}).into ('login')
				.returning('email')
				.then(loginEmail=>{
					trx('users')
						.returning('*')
						.insert ({ //comunication with database and registration of the users inserted in the post method
								email: email,
								name: name,
								joined: new Date()
						}).then (user =>{
							res.json(user[0]);
						}).catch(err => res.status(400).json('unable to register'));
				})
				.then(trx.commit)
				.catch(trx.rollback);
			})
		}
	});	
}

module.exports = {
	handleRegister: handleRegister
}