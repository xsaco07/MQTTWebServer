const mongoose = require('mongoose');

const url = 'mongodb+srv://root:inrootpassword@i-cluster01.qumlq.mongodb.net/EcoProjectDB?retryWrites=true&w=majority';

const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};

const makeDB = async () => {return await mongoose.connect(url, connectionOptions);};

module.exports = makeDB;
