// Create web server using Express
var express = require('express');
var router = express.Router();

// Import comment model
var Comment = require('../models/comment');

// Import post model
var Post = require('../models/post');

// GET handler for /comments
router.get('/', function(req, res) {
  // Find all comments
  Comment.find(function(err, comments) {
    // If error, return error
    if (err) {
      return res.status(500).json({
        message: 'Error getting comments',
        error: err
      });
    }
    // If no error, return comments
    return res.json(comments);
  });
});

// GET handler for /comments/:id
router.get('/:id', function(req, res) {
  // Find a comment by its id
  Comment.findById(req.params.id, function(err, comment) {
    // If error, return error
    if (err) {
      return res.status(500).json({
        message: 'Error getting comment',
        error: err
      });
    }
    // If no error, return comment
    return res.json(comment);
  });
});

// POST handler for /comments
router.post('/', function(req, res) {
  // Create a new comment
  var comment = new Comment({
    content: req.body.content
  });
  // Save the comment
  comment.save(function(err) {
    // If error, return error
    if (err) {
      return res.status(500).json({
        message: 'Error saving comment',
        error: err
      });
    }
    // If no error, find the post with the same id as the comment
    Post.findById(req.body.postId, function(err, post) {
      // If error, return error
      if (err) {
        return res.status(500).json({
          message: 'Error finding post',
          error: err
        });
      }
      // If no error, add the comment to the post
      post.comments.push(comment);
      // Save the post
      post.save(function(err) {
        // If error, return error
        if (err) {
          return res.status(500).json({
            message: 'Error saving post',
            error: err
          });
        }
        // If no error, return comment
        return res.json(comment);
      });
    });
  });
});

// PUT handler for /comments/:id
router
