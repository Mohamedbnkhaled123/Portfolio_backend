const mongoose = require('mongoose');
const mongoURI = 'mongodb://127.0.0.1:27017/portfolioDB';

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const homes = await mongoose.connection.db.collection('homes').find().toArray();
    console.log('Homes count:', homes.length);
    console.log('Homes documents:', JSON.stringify(homes, null, 2));

    const contacts = await mongoose.connection.db.collection('contacts').find().toArray();
    console.log('Contacts count:', contacts.length);
    console.log('Contacts documents:', JSON.stringify(contacts, null, 2));

    const skills = await mongoose.connection.db.collection('skills').find().toArray();
    console.log('Skills count:', skills.length);
    console.log('Skills documents:', JSON.stringify(skills, null, 2));
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
  });
