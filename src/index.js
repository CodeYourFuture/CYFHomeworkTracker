import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./index.css";
import SelectionScreen from "./screen/select/SelectionScreen";
import Firebase from "./repo/Firebase.js";
import LoginScreen from "./screen/login/LoginScreen";
import AuthRepository from "./repo/AuthRepository";
import GithubRepository from "./repo/GithubRepository";
import StudentRepository from "./repo/StudentRepository";
import HomeworkPage from "./screen/homework/HomeworkPage";
import StudentsPage from "./screen/students/StudentsPage";
import Homepage from "./screen/home/Homepage";
import ActivityPage from "././screen/activity/ActivityPage";

let firebase = new Firebase();
let studentRepo = new StudentRepository(firebase);
let authRepo = new AuthRepository(firebase);
let githubRepo = new GithubRepository(authRepo);

const routing = (
  <Router>
    <div>
      <Route
        exact
        path={process.env.PUBLIC_URL + "/"}
        component={() => (
          <SelectionScreen
            githubRepo={githubRepo}
            authRepo={authRepo}
            studentRepo={studentRepo}
          />
        )}
      />
      <Route
        exact
        path={process.env.PUBLIC_URL + "/login"}
        component={() => <LoginScreen authRepo={authRepo} />}
      />
      <Route
        exact
        path={process.env.PUBLIC_URL + "/schools/:city"}
        component={() => (
          <Homepage
            githubRepo={githubRepo}
            authRepo={authRepo}
            studentRepo={studentRepo}
          />
        )}
      />
      <Route
        exact
        path={process.env.PUBLIC_URL + "/schools/:city/homework"}
        component={() => (
          <HomeworkPage
            githubRepo={githubRepo}
            authRepo={authRepo}
            studentRepo={studentRepo}
          />
        )}
      />
      <Route
        exact
        path={process.env.PUBLIC_URL + "/schools/:city/students"}
        component={() => (
          <StudentsPage
            githubRepo={githubRepo}
            authRepo={authRepo}
            studentRepo={studentRepo}
          />
        )}
      />
      <Route
        exact
        path={process.env.PUBLIC_URL + "/schools/:city/activity"}
        component={() => (
          <ActivityPage
            githubRepo={githubRepo}
            authRepo={authRepo}
            studentRepo={studentRepo}
          />
        )}
      />
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));
