const express = require('express');
const os = require('os');
const bodyParser = require('body-parser').urlencoded({ extended: true });

const app = express();

// =================== MONGOOSE STUFF ==================
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/defacatinc');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Mongoose is up and running!'));

const shitgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	capacity: Number,
	description: String,
});

const Shitground = mongoose.model('Shitground', shitgroundSchema);
Shitground.deleteMany({}).then();
Shitground.insertMany(
	[
		{
			name: 'Mountain everest peak',
			image: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Mount_Everest_as_seen_from_Drukair2_PLW_edit.jpg',
			description: 'Highest shit you will ever take without being baked',
		},
		{
			name: 'Korilovos mountain',
			image: 'https://ergasia-press.gr/wp-content/uploads/2017/06/simaia_korylovos_1.jpg',
			description: 'If you ever came in Drama, you definitly need to take a shit here',
		},
		{
			name: 'Papa\'s basement',
			image: 'https://geekologie.com/2008/06/03/hardcore-gamer.jpg',
			description: 'Summon your childhood memories',
		},
	],
	(err) => {
		if (err) { console.log(err); }
	},
);
// =================== MONGOOSE STUFF ==================

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/shitgrounds', (req, res) => {
	// eslint-disable-next-line array-callback-return
	Shitground.find((err, shitgrounds) => {
		if (err) {
			console.log(err);
			res.redirect('/');
		}
		res.render('shitgrounds/index', { shitgrounds });
	});
});

app.post('/shitgrounds', bodyParser, (req, res) => {
	Shitground.create(
		{
			name: req.body.name,
			image: req.body.image,
			description: req.body.description,
		},
		(err) => {
			if (err) {
				console.log(err);
			}
		},
	);
	res.redirect('/shitgrounds');
});

app.get('/shitgrounds/new', (req, res) => {
	res.render('shitgrounds/new');
});

app.get('/shitgrounds/:id', (req, res) => {
	Shitground.findById(req.params.id, (err, groundFound) => {
		if (err) res.redirect('/shitgrounds');
		res.render('shitgrounds/show', { ground: groundFound });
	});
});

app.listen(3000, () => {
	const systemInfo = `Cpu architecture: ${os.arch()}
Number of cpus: ${os.cpus().length}
System endianness: ${os.endianness()}
System Free memory/Total memory: ${os.freemem()}/${os.totalmem()}
System hostname: ${os.hostname()}
System platform: ${os.platform()}
System releash: ${os.release()}
System uptime (minutes): ${os.uptime() / 60}`;
	console.log(`${systemInfo + os.EOL}Sh!t server is running!`);
});
