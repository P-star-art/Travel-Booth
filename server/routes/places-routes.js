const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('Request made');
    res.json({"message" : "successufull"})
})

module.exports = router