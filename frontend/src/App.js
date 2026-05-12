import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [place, setPlace] = useState("");
  const [budget, setBudget] = useState("");
  const [member, setMember] = useState("");

  const [trips, setTrips] = useState([]);

  const [stats, setStats] = useState({});


  async function fetchData() {

    const tripData = await axios.get(
      "http://localhost:5000/trips"
    );

    const statsData = await axios.get(
      "http://localhost:5000/stats"
    );

    setTrips(tripData.data);

    setStats(statsData.data);
  }



  useEffect(function () {

    fetchData();

  }, []);


  async function addTrip() {

    if (place === "") {
      return;
    }

    await axios.post(
      "http://localhost:5000/trip",
      {
        place: place,
        budget: budget,
        member: member,
        status: "Planning"
      }
    );

    setPlace("");
    setBudget("");
    setMember("");

    fetchData();
  }


  async function moveTrip(id, status) {

    await axios.put(
      "http://localhost:5000/trip/" + id,
      {
        status: status
      }
    );

    fetchData();
  }


  async function deleteTrip(id) {

    await axios.delete(
      "http://localhost:5000/trip/" + id
    );

    fetchData();
  }




  return (

    <div>

      <div className="header">

        Trip Planner

      </div>


      <div className="hero">

        <h1>
          Plan Your Dream Trips 
        </h1>

        <p>
          Manage travel plans, budgets,
          members and trip progress.
        </p>

      </div>


      <div className="stats">

        <div className="statCard">
          Trips: {stats.total || 0}
        </div>

        <div className="statCard">
          Planning: {stats.planning || 0}
        </div>

        <div className="statCard">
          Ongoing: {stats.ongoing || 0}
        </div>

        <div className="statCard">
          Completed: {stats.completed || 0}
        </div>

      </div>


      <div className="inputBox">

        <input
          type="text"
          placeholder="Destination"
          value={place}
          onChange={function (e) {
            setPlace(e.target.value);
          }}
        />

        <input
          type="text"
          placeholder="Budget"
          value={budget}
          onChange={function (e) {
            setBudget(e.target.value);
          }}
        />

        <input
          type="text"
          placeholder="Members"
          value={member}
          onChange={function (e) {
            setMember(e.target.value);
          }}
        />

        <button onClick={addTrip}>
          Add Trip
        </button>

      </div>


      {
        trips.length === 0 && (

          <div className="emptyCard">

            <h2>No Trips Added</h2>

            <p>
              Start planning your next adventure 
            </p>

          </div>
        )
      }




      {/* TRIP CARDS */}
      <div className="tripContainer">

        {
          trips.map(function (trip) {

            return (

              <div className="tripCard" key={trip._id}>


                <div className="tripImage">

                </div>


                <div className="tripContent">

                  <h2>{trip.place}</h2>

                  <p>
                    Budget: ₹{trip.budget}
                  </p>

                  <p>
                    Members: {trip.member}
                  </p>

                  <p>
                    Status: {trip.status}
                  </p>



                  {
                    trip.status === "Planning" && (

                      <button
                        onClick={function () {
                          moveTrip(
                            trip._id,
                            "Ongoing"
                          );
                        }}
                      >
                        Start Trip
                      </button>

                    )
                  }



                  {
                    trip.status === "Ongoing" && (

                      <button
                        onClick={function () {
                          moveTrip(
                            trip._id,
                            "Completed"
                          );
                        }}
                      >
                        Complete
                      </button>

                    )
                  }



                  <button
                    onClick={function () {
                      deleteTrip(trip._id);
                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>

            );

          })
        }

      </div>

    </div>
  );
}

export default App;


