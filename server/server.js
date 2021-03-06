const app = require('express')(),
	cors = require('cors');

const store = require('./store.json'),
	constants = require('./constants.json');

app.use(cors());

app.get('/api/get-monuments', function(req, res) {
	let {searchedTerm, type, ethnicity, owner, dating, area} = req.query;

	res.json({
		monuments: store
			.filter(monument => 
				(searchedTerm ? monument['Denumirea in muzeu'].toLowerCase().includes(searchedTerm.toLowerCase()) : true) &&
				(type ? monument['Tipul ansamblului'].includes(type) : true) &&
				(ethnicity ? monument['Etnia'].includes(ethnicity) : true) &&
				(owner ? monument['Muzeul detinator'].includes(owner) : true) &&
				(dating ? monument['Datarea'].includes(dating) : true) &&
				(area ? monument['Zona ennografica de provenienta'].includes(area) : true) &&
				monument['Descriere']
			)
			.map(monument => ({
				id: monument.id,
				title: monument['Denumirea in muzeu'],
				thumbnail: monument['URL-ul imaginii'] || 'http://www.fenland.gov.uk/media/11083/Placeholder-Image/thumbnail/20140518072131!Placeholder.jpg',
				description: monument['Descriere']
			}))
	})
});

app.get('/api/get-monument', function(req, res) {
	let {monumentId} = req.query,
		{
			["Muzeul detinator"]: museum,
			["Denumirea ansamblului"]: name,
			["Tipul ansamblului"]: type,
			["Denumirea in muzeu"]: title,
			["Denumirea la origice"]: originalName,
			["Etnia"]: ethnicity,
			["Datarea"]: dating,
			["Zona ennografica de provenienta"]: area,
			["Localitatea de provenienta"]: locality,
			["Descriere"]: description,
			["Imprejmuiri"]: fencing,
			["Bibliografie"]: bibliography,
			["URL-ul imaginii"]: thumbnail,		
		} = store.find(({id}) => id === monumentId) || {};
		
	res.json({
		museum,
		name,
		type,
		title,
		originalName,
		ethnicity,
		dating,
		area,
		locality,
		description,
		fencing,
		bibliography,
		thumbnail
	});
});

app.get('/api/get-filters-config', function(req, res) {
	let filtersConfig = {
		type: constants.type,
		ethnicity: constants.ethnicity,
		owner: [],
		dating: [],
		area: []
	}

	store.forEach(monument => {
		monument['Muzeul detinator'] && 
		!filtersConfig.owner.includes(monument['Muzeul detinator']) && 
		filtersConfig.owner.push(monument['Muzeul detinator']);
		
		monument['Datarea'] && 
		!filtersConfig.dating.includes(monument['Datarea']) && 
		filtersConfig.dating.push(monument['Datarea']);
		
		monument['Zona ennografica de provenienta'] && 
		!filtersConfig.area.includes(monument['Zona ennografica de provenienta']) && 
		filtersConfig.area.push(monument['Zona ennografica de provenienta']);
	});

	res.json(filtersConfig);
});

app.listen('8888', function() {
	console.log('App running on port 8888');
});