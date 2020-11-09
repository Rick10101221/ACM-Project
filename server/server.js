const express = require('express');
const app = express();
const fetch = require('node-fetch');
const { db, admin } = require('./firebase');
const cors = require('cors');

// Routers
const users = require('./functions/users');
const events = require('./functions/events');
const applications = require('./functions/applications');

// Configure app to use bodyParser
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cors());

//example API call
app.get('/api/customers', (req, res) => {
  const collection = db.collection('fakeCollection').doc();
  const customers = {
    eventName: "title"
  }
  collection.set(customers);
  res.json(customers)
})

function checkAuth(req, res, next){
  if (req.headers.authtoken) {
    admin.auth().verifyIdToken(req.headers.authtoken)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(403).send("Unauthorized")
    });
  }
  else {
    res.status(403).send("Unauthorized")
  }
}

app.get('/api/getCustomers/:postID/:userID', async (req, res) => {

  //gets all docs in users that has the search id match the param sent in
  const collection = await db.collection('users');
  const query = await collection.where("search_id", "==", req.params.postID).where("user_id", "==", req.params.userID).get();

  //results are stored in an array
  let results = [];

  //for each firestore doc returned, store the data into the array
  query.forEach(doc=>{
    //same as results.push(doc.data())
    results = [...results, doc.data()]
  })
  console.log(results)
  //return the data from firestore to the person loading the link
  res.json(results)
})

<<<<<<< HEAD
=======
//get all the user routes from users.js
>>>>>>> 2ed27bbcd6001af30b7cbf06276d41e082adceee
//app.use('/users', checkAuth)
app.use('/users', users)
app.use('/events', events)
app.use('/applications', applications)

const port = 5000;

app.listen(port, () => {
  console.log(`server started on port ${port}`)
})