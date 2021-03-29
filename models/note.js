const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    modified: {
        type: Date,
        required: true,
        default: Date.now
    },
    isLatest: {
        type: Boolean,
        required: true,
        default: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    parentId: {
        type: String,
        required: false,
    }
}) 

module.exports = mongoose.model('Note', noteSchema)