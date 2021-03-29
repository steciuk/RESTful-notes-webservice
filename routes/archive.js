const express = require('express')
const router = express.Router()
const Note = require('../models/note')

const sortOptions = [
    {
        value: 'modifiedDesc',
        label: 'Modified, from newest'},
    {
        value: 'modifiedAsc',
        label: 'Modified, from oldest'},
    {
        value: 'createdDesc',
        label: 'Created, from newest'},
    {
        value: 'createdAsc',
        label: 'Created, from oldest'},
    {
        value: 'alphaAsc',
        label: 'Title, A-Z'},
    {
        value: 'alphaDesc',
        label: 'Title, Z-A'}
]

router.get('/', async (req, res) => {
    try {
        const notes = await sortNotes(req.query.sortBy)
        res.render('archive/index', { 
            notes: notes,
            sortOptions: sortOptions,
            sortChosen: req.query.sortBy
        })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const notes = await getAllVersionsOfNote(req.params.id)
        res.render('archive/show', { notes: notes })
    } catch (error) {
        console.log(error) 
        res.redirect('/archive') 
    }
})

async function getAllVersionsOfNote (id) {
    const note = await Note.findById(id)
    const notes = await Note.find({ parentId: note.parentId }).sort({ modified: 'desc' }).exec()
    if (notes.length === 0) throw new Error('No such note')
    return notes
}

async function sortNotes(sortBy = "modifiedDesc") {
    if (sortBy === "modifiedDesc") return await Note.find({ isLatest: true }).sort({ modified: 'desc' }).exec()
    if (sortBy === "modifiedAsc") return await Note.find({ isLatest: true }).sort({ modified: 'asc' }).exec()
    if (sortBy === "createdDesc") return await Note.find({ isLatest: true }).sort({ created: 'desc' }).exec()
    if (sortBy === "createdAsc") return await Note.find({ isLatest: true }).sort({ created: 'asc' }).exec()
    if (sortBy === "alphaAsc") return await Note.find({ isLatest: true }).sort({ title: 'asc' }).exec()
    if (sortBy === "alphaDesc") return await Note.find({ isLatest: true }).sort({ title: 'desc' }).exec()
}
module.exports = router