const express = require('express');
const router = express.Router()
const { json } = require('express');
const {db, admin} = require('../firebase');

// Configure app to use bodyParser
router.use(express.urlencoded({
  extended: true
}));
router.use(express.json());

function checkAuth(req, res, next){
  if (req.headers.authtoken) {
    admin.auth().verifyIdToken(req.headers.authtoken)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(403).send("Unauthorized");
    });
  }
  else {
    res.status(403).send("Unauthorized");
  }
}

const userCollection = db.collection("users");

// @route POST user
// @desc Creates a user object and stores it in the "users" collection in firestore
router.post('/create', async (req, res) => {
  let passRE = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,26}$/);
  let emailRE = new RegExp(/\b[A-Za-z0-9._%+-]+@([Uu][Cc][Ss][Dd].[Ee][Dd][Uu])\b/);
  console.log(req.body.email.match(emailRE));
  console.log(req.body.password.match(passRE));
  if (!req.body || !req.body.firstName || req.body.firstName == "" || req.body.lastName == "" || !req.body.lastName 
      || !req.body.email || !req.body.password || !req.body.email.match(emailRE) || !req.body.password.match(passRE)){
    res.json({error: "Missing fields on request or wrong format for inputs"});
  }
  else {
    //console.log(req.body)
     // Generate a reference to a doc with unique ID

    admin.auth().createUser({
      email: req.body.email,
      disabled: false,
      password: req.body.password
    })
    .then(function(userRecord){
      const newUserRef = userCollection.doc(userRecord.uid)
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        user_id: userRecord.uid,
        user_events: []
      }

      newUserRef.set(user)
      .then(function(){
        console.log("Successfully created a new user: ", userRecord.uid);
        res.json(userRecord);
      })
      .catch(function(error) {
        console.error("Error adding user document: ", error)
        res.status(400).send(error)
      })
    })
    .catch(function(error){
      console.log("Error creating a new user: ", error);
      res.status(400).send(error);
    });
  }
})

// @route PUT user
// @desc Updates a user object with new name fields
router.put('/update/:userId', checkAuth, async (req, res) => {
  if (!req.params.userId) res.status(400).send("No user id provided");
  if (!req.body.firstName || !req.body.lastName) res.status(400).send("No names provided")
  const userRef = await userCollection.doc(req.params.userId);
  const doc = await userRef.get();
  if (!doc.exists) {
    res.status(400).send("No such user document exists");
  }
  else {
    const resp = await userRef.update({
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });
    res.status(200).send("Success");
  }
})

// @route GET user
// @desc returns a user object from the "users" collection in firestore given an id
router.get('/:userId', checkAuth, async (req, res) => {
  if (!req.params.userId) res.status(400).send("No user id provided");
  const userRef = await userCollection.doc(req.params.userId);
  const doc = await userRef.get();
  if (!doc.exists) {
    res.status(400).send("No such user document exists");
  }
  else {
    res.json(doc.data());
  }
})

// @route GET user(s)
// @desc returns user object(s) from the "users" collection in firestore given query (or queries)
router.get('/', checkAuth, async (req, res) => {
  let queryResults = await userCollection.get();
  let results = [];
  queryResults.forEach(doc => {
    results.push(doc.data())
  })
  res.json(results);
})

module.exports = router