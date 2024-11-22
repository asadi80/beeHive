const router = require("express").Router();
// Home route


router.get("/",  (req, res) => {
    res.send('home route');
    
});


module.exports = router;