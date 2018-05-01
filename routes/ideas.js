const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Load Idea Model
require('../models/Ideas');
const idea = mongoose.model('ideas');


//Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
    idea.find({user: req.user.id})//only retrieves ideas from user id
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        })
})

//Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if(idea.user != req.user.id){
                req.flash('error_msg', 'Not Authroized');
                res.redirect('/ideas');
            } else {
            res.render('ideas/edit', {
                idea: idea
            });
        }
        });
});

//Post request to mongodb
router.post('/', ensureAuthenticated, (req, res) => {
    //error handling
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' })
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
        //if no errors
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video Idea Added');
                res.redirect('/ideas');
            })
    }
});

//edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    idea.findOne({
        _id: req.params.id
    })
        .then(
        idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video Idea Updated');
                    res.redirect('/ideas')
                })
        }
        );
});

//Delete idea 
router.delete('/:id', ensureAuthenticated, (req, res) => {
    idea.remove({
        _id: req.params.id
    })
        .then(() => {
            req.flash('success_msg', 'Video Idea Removed');
            res.redirect('/ideas');
        });
});

module.exports = router;