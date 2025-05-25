const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image: {type: String, require: true},
    title: {type: String, require: true, unique: true},
    content: {type: String, require: true}
});

module.exports = mongoose.model('Post', postSchema);