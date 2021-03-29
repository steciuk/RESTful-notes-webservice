const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const mongoose = require('mongoose')

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

// All notes
router.get('/', async (req, res) => {
    try {
        const notes = await sortNotes(req.query.sortBy)
        res.render('notes/index', { 
            notes: notes,
            sortOptions: sortOptions,
            sortChosen: req.query.sortBy
        })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

// New note form
router.get('/new', (req, res) => {
    res.render('notes/new', { note: new Note() })
})

// Create note
router.post('/', async(req, res) => {
    let note = new Note({
        title: req.body.title,
        content: req.body.content
    })

    try {
        note.parentId = note.id
        const newNote = await note.save();
        res.redirect(`notes/${newNote.id}`)
    } catch (error) {
        console.log(error);
        const params = {
            note: note,
            errorMessage: 'Error creating note'
        }
        res.render('notes/new', params)
    }
})

// Show note
router.get('/:id', async (req, res) => {
    try {
        const note = await getNoteById(req.params.id)
        res.render('notes/show', { note: note })
    } catch (error) {
        console.log(error) 
        res.redirect('/notes')
    }
})

// Get edit form
router.get('/:id/edit', async (req, res) => {
    try {
        const note = await getNoteById(req.params.id)
        res.render('notes/edit', { note: note })
    } catch (error) {
        console.log(error);
        res.redirect('/notes')
    }
})

// Update note
router.put('/:id', async (req, res) => {
    let note
    try {
        note = await getNoteById(req.params.id)
        let newNote = new Note()
        note.isLatest = false
        newNote.parentId = note.parentId
        newNote.created = note.created
        newNote.title = req.body.title
        newNote.content = req.body.content
        newNote.modified = Date.now()
        await newNote.save()
        await note.save();
        res.redirect(`/notes/${newNote.id}`)
    } catch (error) {
        console.log(error);
        if (note == null) {
            res.redirect('/')
        } else {
            const params = {
                note: note,
                errorMessage: 'Error updating note'
            }
            res.render('notes/edit', params)
        }
    }
})

// Delete note
router.delete('/:id', async (req, res) => {
    let note
    try {
        note = await getNoteById(req.params.id)
        note.modified = Date.now()
        note.isDeleted = true
        await note.save();
        res.redirect(`/notes`)
    } catch (error) {
        console.log(error);
        if (note == null) {
            res.redirect('/notes')
        } else {
            res.redirect(`/notes/${note.id}`)
        }
    }
})

async function sortNotes(sortBy = "modifiedDesc") {
    if (sortBy === "modifiedDesc") return await Note.find({ isDeleted: false, isLatest: true }).sort({ modified: 'desc' }).exec()
    if (sortBy === "modifiedAsc") return await Note.find({ isDeleted: false, isLatest: true }).sort({ modified: 'asc' }).exec()
    if (sortBy === "createdDesc") return await Note.find({ isDeleted: false, isLatest: true }).sort({ created: 'desc' }).exec()
    if (sortBy === "createdAsc") return await Note.find({ isDeleted: false, isLatest: true }).sort({ created: 'asc' }).exec()
    if (sortBy === "alphaAsc") return await Note.find({ isDeleted: false, isLatest: true }).sort({ title: 'asc' }).exec()
    if (sortBy === "alphaDesc") return await Note.find({ isDeleted: false, isLatest: true }).sort({ title: 'desc' }).exec()
}
 
async function getNoteById (id) {
    const notes = await Note.findById(id).find({ isDeleted: false, isLatest: true }).exec()
    const note = notes[0]
    if (note == null) throw new Error('No such note')
    return note
}

module.exports = router