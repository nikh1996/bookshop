const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb://nodenikhadmin:nikh1996@ds159110.mlab.com:59110/bookshop')
.then(console.log('Connected to MongoDB...'))
.catch(err => console.error("Couldn't connect to DB",err));

module.exports = connection;