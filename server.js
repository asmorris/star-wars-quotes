var express = require('express')
var mongo = require('mongodb').MongoClient
var bodyParser = require('body-parser')
var app =express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
var database

mongo.connect('mongodb://andrew:lakeview@ds159217.mlab.com:59217/star-wars-quotes', (err, db) => {
	if (err) return console.log(err)
	database = db
	app.listen(3000, function() {
		console.log('listening on 3000')
	})

})

app.get('/', (req, res) => {
	database.collection('quotes').find().toArray((err,result) => {
		if (err) return console.log(err)
		res.render('index.ejs', {quotes: result})
	})
})

app.post('/quotes', (req,res) => {
	database.collection('quotes').save(req.body, (err, result) => {
		if (err) return console.log(err)

		console.log('saved to database')
		res.redirect('/')
	})
})

app.put('/quotes', (req,res) => {
	database.collection('quotes')
	.findOneAndUpdate({name: 'Yoda'}, {
		$set: {
			name: req.body.name,
			quote: req.body.quote
		}
	}, {
		sort: {_id: -1},
		upsert: true
	}, (err, result) => {
		if (err) return res.send(err)
		res.send(result)
	})
})

app.delete('/quotes', (req, res) => {
	database.collection('quotes').findOneAndDelete({name: req.body.name},
	(err, result) => {
		if (err) return res.send(500, err)
		res.send('A darth vader quote was deleted')
	})
})
