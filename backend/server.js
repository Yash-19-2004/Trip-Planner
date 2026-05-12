const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());



mongoose.connect(
  "mongodb://localhost:27017/tripDB"
);




const Trip = mongoose.model("Trip", {

  place: String,

  budget: String,

  member: String,

  status: String

});


app.post("/trip", async function (req, res) {

  const newTrip = new Trip({

    place: req.body.place,

    budget: req.body.budget,

    member: req.body.member,

    status: req.body.status

  });

  await newTrip.save();

  res.json(newTrip);

});


app.get("/trips", async function (req, res) {

  const trips = await Trip.find();

  res.json(trips);

});



app.put("/trip/:id", async function (req, res) {

  await Trip.findByIdAndUpdate(

    req.params.id,

    {
      status: req.body.status
    }

  );

  res.json({
    message: "Trip Updated"
  });

});



app.delete("/trip/:id", async function (req, res) {

  await Trip.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Trip Deleted"
  });

});


app.get("/stats", async function (req, res) {

  const trips = await Trip.find();

  let planning = 0;
  let ongoing = 0;
  let completed = 0;

  trips.forEach(function (trip) {

    if (trip.status === "Planning") {
      planning++;
    }

    if (trip.status === "Ongoing") {
      ongoing++;
    }

    if (trip.status === "Completed") {
      completed++;
    }

  });

  res.json({

    total: trips.length,

    planning: planning,

    ongoing: ongoing,

    completed: completed

  });

});




app.listen(5000, function () {

  console.log("Server Running On Port 5000");

});



