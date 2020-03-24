const express = require("express");

const database = require("./users-model.js");

const router = express.Router();

router.get("/all", (req, res) => {

    database.getAllUsers()
        .then(users =>
            res.status(200).json(users))
        .catch(({stack, message}) =>
            res.status(200).json({error: "Could not retrieve users:", stack, message}))
})

router.get("/", restrictedView, (req, res) => {

    database.getUsersByDepartment(req.decodedToken.department)
        .then(users =>
            res.status(200).json(users))
        .catch(({stack, message}) =>
            res.status(200).json({error: "Could not retrieve users:", stack, message}))
})
function restrictedView (req, res, next) {

    console.log("token data:", req.decodedToken);

    // only allow users to view people in the same department
    if (!req.decodedToken)
        { res.status(401).json({message: "Not authenticated, so no users are shown. "})}

    else if (!req.decodedToken.department)
        { res.status(403).json({message: "Department unknown, so no users are shown. "})}

    else
        { next(); }
}


module.exports = router;