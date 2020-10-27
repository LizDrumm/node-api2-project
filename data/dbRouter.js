const express = require('express')
const Data = require('./db.js')

const router = express.Router()


// | POST| /api/posts| Creates a post using the information sent inside the `request body`. 
router.post('/api/posts', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({ error: 'Please provide title and contents for the post' })
    } else {
        Data.insert({ title, contents })
            .then(post => {
                res.status(201).json( post )
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" , stack: err.stack })
            })
    }
})


// | POST   | /api/posts/:id/comments | Creates a comment for the post with the specified id using information sent inside of the `request body`.

router.post('/api/posts/:id/comments', (req, res) => {
    const { text } = req.body
    const { id } = req.params
    try {
        if(!text) {
            res.status(400).json({ message: 'Please provide text for the comment' })
        } else {
            Data.insertComment({ text, post_id: id })
                .then(comment => {
                    res.status(201).json(comment)
                })
                .catch(err => {
                    console.log(err)
                    res.status(404).json({ message: `The post with the specified ID does not exist. ID: ${id} `})
                })
        }
    } catch(error) {
        res.status(500).json({ message: 'There was an error while saving the comment to the database', stack: error.stack })
    }
})




// | GET | /api/posts | Returns an array of all the post objects contained in the database.

router.get('/api/posts', (req, res) => {
    console.log(req.query) 
    Data.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'The posts information could not be retrieved',
        stack: error.stack
      });
    });
  });

// | GET | /api/posts/:id | Returns the post object with the specified id.
//cancel the request???- Ask Jazmine.

router.get('/api/posts/:id', (req, res) => {
    const { id } = req.params
    Data.findById(id)
        .then(post =>
            post.length ? 
            res.status(200).json({post}) 
            : res.status(404).json({
                message: `The post with the specified ID does not exist. id: ${id}` 
            }))
        .catch(err => {
            res.status(500).json({ message: 'The post information could not be retrieved', stack: err.stack })
        })
})



// | GET| /api/posts/:id/comments | Returns an array of all the comment objects associated with the post with the specified id. 
router.get('/api/posts/:id/comments', (req, res) => {
    const { id } = req.params
    Data.findById(id)
        .then(post => {
            if (post.length) {
                Data.findPostComments(id)
                    .then(comments => {
                        res.status(200).json(comments )
                    })
                    .catch(err => {
                        res.status(500).json({ message: 'The comments information could not be retrieved.', stack: err.stack })
                    })
            } else {
                res.status(404).json({ message: `The post with the specified ID does not exist ID: ${id}` })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Failure getting comments', stack: err.stack })
        })
})

// | DELETE | /api/posts/:id | Removes the post with the specified id and returns the **deleted post object**. You may need to make additional calls to the database in order to satisfy this requirement. |
router.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params
    Data.remove(id)
        .then(post => {
            if (post === 1) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: `The post with the specified ID does not exist. ID: ${id}` })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'The post could not be removed', stack: err.stack })
        })
})


// | PUT| /api/posts/:id | Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**. 
router.put('/api/posts/:id', (req, res) => {
    const { title, contents } = req.body
    const { id } = req.params
    if (!title || !contents) {
        res.status(400).json({ message: 'Please provide title and contents for the post.'})
    } else {
       Data.update(id, { title, contents })
            .then(post => {
                if (post === 1) {
                    res.status(200).json(post)
                } else {
                    res.status(404).json({ message: `The post with the specified ID does not exist. ID: ${id}` })
                }
            })
            .catch(err => {
                res.status(500).json({ message: 'The post information could not be modified', stack: err.stack })
            })
    }
})


module.exports = router