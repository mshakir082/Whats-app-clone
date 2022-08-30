import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./Components/Sidebar.jsx";
import Chat from "./Components/Chat.jsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Components/Login.jsx";
import { useStateValue } from "./StateProvider";
import db from "./firebase";
import { auth } from "./firebase";
import { actionTypes } from "./reducer";
import Loading from "./Components/Loading.jsx";

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setLoading(true);
    
    const listener = auth.onAuthStateChanged((authUser) => {
      setLoading(false);
      if (authUser) {
        dispatch({
          type: actionTypes.SET_USER,
          user: authUser,
        });
      } else {
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        });
      }
    });
    return () => listener();
  }, [dispatch]);

  const deleteGroup = (groupId) => {
    db.collection("Rooms")
      .doc(groupId)
      .delete()
      .then(() => {
        alert("Chat Deleted");
      });
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__top">
          <Router basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route path="/" exact>
                <Sidebar hide={false} />
                <Chat hide={true} deleteGroup={deleteGroup} />
                <div className="whats_right"></div>
              </Route>
              <Route path="/rooms/:id">
                <Sidebar hide={true} />
                <Chat hide={false} deleteGroup={deleteGroup} />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
