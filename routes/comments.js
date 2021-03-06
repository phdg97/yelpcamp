const express = require('express')
const router = express.Router({ mergeParams: true })
const Campground = require('../models/campground')
const Comment = require('../models/comment')
const middleware = require('../middleware/index')

router.get('/new', middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err)
		} else {
			res.render('comments/new', { campground: campground })
		}
	})
})

router.post('/', middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err)
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					req.flash('erro', 'Something went wrong!')
					console.log(err)
				} else {
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.save()

					campground.comments.push(comment._id)
					campground.save()
					
					req.flash('success', 'Successfully added comment')
          
					res.redirect(`/campgrounds/${campground._id}`)
				}
			})
		}
	})
})

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err || !campground) {
			req.flash('error', 'Campground not found')
			return res.redirect('back')
		}
		Comment.findById(req.params.comment_id, (err, comment) => {
			if (err) {
				console.log(err)
				res.redirect('back')
			} else {
				res.render('comments/edit', {campground_id: req.params.id, comment: comment})
			}
		})
	})
})

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
		if (err) {
			console.log(err)
			res.redirect('back')
		} else {
			res.redirect(`/campgrounds/${req.params.id}`)
		}
	})
})

router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, err => {
		if (err) {
			console.log(err)
			res.redirect('back')
		} else {
			res.redirect(`/campgrounds/${req.params.id}`)
		}
	})
})

module.exports = router