const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {jwtSecret} = require('../config/secrets.js');

const Users = require('./auth-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user); // new line
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// GET: log out a user
router.get("/logout", (req, res) => {

    // user is not logged in; ignore
    if (!req.session)
        { res.status(200).json({message: "No need to log out if you are not logged in."}) }
    else
    {
        req.session.destroy(error => {
            if (error)
                { res.status(500).json({message: "Could not log out."}) }
            else
                { res.status(200).json({message: "Successfully logged out."}) }
        })
    }
})

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department || 'user'
  };
  const options = {
    expiresIn: '1d',
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, jwtSecret, options); // this method is synchronous
}
module.exports = router;
