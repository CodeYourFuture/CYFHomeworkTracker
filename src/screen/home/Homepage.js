import React from "react";
import "../../main.css";
import cityConfig from "../../config/CityConfig.js";
import { withRouter } from "react-router-dom";
import cookie from "react-cookies";
import Sidebar from "../../components/Sidebar";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Legend,
  Bar,
  ResponsiveContainer
} from "recharts";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendanceData: [],
      averageHomeworkScore: 0,
      averageAttendance: 0,
      averageLate: 0
    };

    this.githubRepo = this.props.githubRepo;
    this.authRepo = this.props.authRepo;
    this.studentRepo = this.props.studentRepo;
    this.city = this.props.match.params.city;
  }

  componentDidMount() {
    let { history } = this.props;

    this.setSchoolFromDefault();

    this.authRepo.registerOnAuthListener(
      user => {
        if (user) {
          this.githubRepo.setToken().then(u => {
            // Do work
          });
        } else {
          history.push(process.env.PUBLIC_URL + "/login");
        }
      },
      () => {
        history.push(process.env.PUBLIC_URL + "/login");
      },
      error => {
        console.log(error);
      }
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.school !== this.state.school) {
      this.getAttendanceForStudents();
      this.getAverageHomeworkScore();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.match.params.city !== nextProps.match.params.city) {
      this.city = nextProps.match.params.city;
      this.setSchoolFromDefault();
      this.resetState();
    }
  }

  resetState() {
    this.setState({
      averageHomeworkScore: 0,
      averageAttendance: 0,
      averageLate: 0
    });
  }

  getAverageHomeworkScore() {
    if (this.state.school !== undefined) {
      this.studentRepo.getAllHomework(this.state.school).then(allHomeworks => {
        let total = allHomeworks.reduce((acc, homework) => {
          return (acc += homework.result);
        }, 0);

        let average = total / allHomeworks.length;

        this.setState({ averageHomeworkScore: average });
      });
    }
  }

  getAttendanceForStudents() {
    if (this.state.school !== undefined) {
      this.studentRepo
        .getAttendanceByWeek(this.state.school)
        .then(orderedData => {
          this.setState({
            attendanceData: orderedData,
            averageAttendance: this.calculateAverageAttendance(orderedData),
            averageLate: this.calculateAverageLate(orderedData)
          });
        });
    }
  }

  calculateAverageAttendance(orderedData) {
    let total = orderedData.reduce((acc, week) => {
      let students = week.students || 0;
      let lateStudents = week.lateStudents || 0;
      let notAttended = week.notAttended || 0;

      return acc + (1 - notAttended / (students + lateStudents));
    }, 0);

    return (total / orderedData.length) * 100;
  }

  calculateAverageLate(orderedData) {
    let total = orderedData.reduce((acc, week) => {
      let students = week.students || 0;
      let lateStudents = week.lateStudents || 0;

      return acc + lateStudents / students;
    }, 0);

    return (total / orderedData.length) * 100;
  }

  setSchoolFromDefault() {
    let defaultSchool = this.city;
    if (defaultSchool != null) {
      this.setSchool(defaultSchool);
    }
  }

  setSchool(schoolName) {
    console.log(schoolName);
    cookie.save("chosenSchool", schoolName, { path: "/" });
    this.setState({ school: this.getSchoolFromName(schoolName) });
  }

  getSchoolFromName(schoolName) {
    return cityConfig.filter(city => {
      return city.name.toLowerCase() === schoolName.toLowerCase();
    })[0];
  }

  getLoading() {
    return (
      <div className="spinner-border spinner-border-sm" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-2">
            <Sidebar
              school={this.state.school}
              history={this.history}
              currentCity={this.city}
            />
          </div>
          <div className="background-body col-10">
            {this.state.school === undefined ? null : (
              <div>
                <div className="container">
                  <div className="card border-0 shadow my-4 text-center">
                    <div className="card-body p-4">
                      <h1 className="font-weight-light">
                        Welcome to <b>{this.state.school.name}</b>
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-4">
                      <div className="card border-0 shadow text-center">
                        <div className="card-body p-4">
                          <h3 className="font-weight-light">
                            Average Homework
                          </h3>
                          <h2>
                            {this.state.averageHomeworkScore !== 0
                              ? this.state.averageHomeworkScore.toFixed(2) +
                                "/10"
                              : this.getLoading()}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="card border-0 shadow text-center">
                        <div className="card-body p-4">
                          <h3 className="font-weight-light">
                            Average Attendance
                          </h3>
                          <h2>
                            {this.state.averageAttendance !== 0
                              ? this.state.averageAttendance.toFixed(2) + "%"
                              : this.getLoading()}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="card border-0 shadow text-center">
                        <div className="card-body p-4">
                          <h3 className="font-weight-light">Average Late</h3>
                          <h2>
                            {this.state.averageLate !== 0
                              ? this.state.averageLate.toFixed(2) + "%"
                              : this.getLoading()}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container mt-4">
                  <div className="card border-0 shadow">
                    <div className="card-body p-4">
                      <h2 className="font-weight-light">Student Attendance</h2>
                      <ResponsiveContainer height={333}>
                        <BarChart data={this.state.attendanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="students"
                            fill="#8884d8"
                            name="Students"
                          />
                          <Bar
                            dataKey="lateStudents"
                            fill="#82ca9d"
                            name="Late Students"
                          />
                          <Bar
                            dataKey="notAttended"
                            fill="#d12f2f"
                            name="Not Attended"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Homepage);
