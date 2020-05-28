import React from "react";
import "../../main.css";
import cityConfig from "../../config/CityConfig.js";
import { withRouter } from "react-router-dom";
import cookie from "react-cookies";
import StudentModal from "../../components/StudentModal";
import ReviewClassModal from "../../components/ReviewClassModal";
import Sidebar from "../../components/Sidebar";

class StudentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
      showOnboarding: false,
      studentModal: { show: false, student: {} },

      reviewModal: { show: false, pullRequest: {} }

    };

    this.githubRepo = this.props.githubRepo;
    this.authRepo = this.props.authRepo;
    this.studentRepo = this.props.studentRepo;
    this.city = this.props.match.params.city;
  }

  componentDidMount() {
    let { history } = this.props;

    this.setState({
      isLoading: true
    });

    let defaultSchool = this.city;
    if (defaultSchool != null) {
      this.setSchool(defaultSchool);
    }

    this.authRepo.registerOnAuthListener(
      user => {
        if (user) {
          this.githubRepo.setToken().then(u => {
            this.setStudentFromParams();
            this.checkVisibility();
          });
        } else {
          history.replace(process.env.PUBLIC_URL + "/login");
        }
      },
      () => {
        history.replace(process.env.PUBLIC_URL + "/login");
      },
      error => {
        console.log(error);
      }
    );
  }

  checkVisibility() {
    this.githubRepo.isUserMentor().then((isMentor) => {
      this.setState({ isMentor: isMentor });
    });
  }

  setStudentFromParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const student = urlParams.get("student");
    if (student !== null) {
      this.onStudentClicked(student);
    }
  }

  setSchool(schoolName) {
    cookie.save("chosenSchool", schoolName, { path: "/" });
    this.setState({ school: this.getSchoolFromName(schoolName) });
  }

  getSchoolFromName(schoolName) {
    return cityConfig.filter(city => {
      return city.name.toLowerCase() === schoolName.toLowerCase();
    })[0];
  }

  onStudentClicked(studentName) {
    this.githubRepo.getStudent(studentName).then(student => {
      console.log(student.data);
      this.setState({
        studentModal: { show: true, student: student.data }
      });
    });
  }

  showReviewClassModal() {
    this.setState({
      reviewClassModal: {
        show: true,
      },
    });
  }

  getBlockedView() {
    return (
      <div className="container">
        <div className="card border-0 shadow my-4">
          <div className="card-body p-4">
            <h1 className="font-weight-light">
              You do not have access to this section. Please contact your City
              Coordinator.
            </h1>
          </div>
        </div>
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

            <StudentModal
              student={this.state.studentModal.student}
              githubRepo={this.githubRepo}
              school={this.state.school}
              showModal={this.state.studentModal.show}
              pullRequestData={this.state.data}
              studentRepo={this.studentRepo}
              closeModal={() => {
                this.setState({
                  studentModal: {
                    show: false,
                    student: this.state.studentModal.student
                  }
                });
              }}
            />
            <div className="container">
              <div className="card border-0 shadow my-4">
                <div className="card-body p-4">
                  <h1 className="font-weight-light text-center">
                    Welcome to the <b>{this.state.school.name}</b> Student
                    Tracker
                  </h1>
                </div>
              </div>
            </div>
            {this.state.school === "None" ? null : (
              <div>
                <div className="container">
                  <div className="card border-0 shadow my-4">
                    <div className="card-body p-4">
                      <h1 className="font-weight-light text-center">
                        Students
                      </h1>
                      {this.state.school.students.map(studentName => {
                        return (

                          <button
                            type="button"
                            className="btn btn-primary btn-lg"
                            onClick={() => {
                              this.showReviewClassModal();
                            }}
                          >
                            Report on Whole Class
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <div className="card border-0 shadow my-4">
                        <div className="card-body p-4">
                          <h1 className="font-weight-light">Students</h1>
                          {this.state.school.students.map((studentName) => {
                            return (
                              <button
                                key={studentName}
                                className="btn btn-outline-secondary btn-sm m-1"
                                onClick={() => {
                                  this.onStudentClicked(studentName);
                                }}
                              >
                                {studentName}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              this.getBlockedView()
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(StudentPage);
