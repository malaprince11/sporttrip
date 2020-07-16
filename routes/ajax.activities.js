const express = require("express");
const activityModel = require("../models/Activities")
const router = express.Router();


router.get("/search",(req,res,next) => {

    console.log(req.query);
    activityModel.find(req.query).then(dbResult => {
        res.json(dbResult)
    }).catch(next)

})



module.exports = router;