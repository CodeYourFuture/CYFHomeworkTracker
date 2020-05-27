import React from "react";
import "../../main.css";
import cityConfig from "../../config/CityConfig.js";
import { withRouter } from "react-router-dom";
import cookie from "react-cookies";
import StudentModal from "../../components/StudentModal";
import LeaveNoteModal from "../../components/LeaveNoteModal";
import ReviewClassModal from "../../components/ReviewClassModal";
import Sidebar from "../../components/Sidebar";
import SetAttendanceModal from "../../components/SetAttendanceModal";
import AttendanceModal from "../../components/AttendanceModal";

class StudentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
      showOnboarding: false,
      studentModal: { show: false, student: {} },
      reviewClassModal: { show: false },
      leaveNoteModal: { show: false },
      updateAttendanceModal: { show: false },
      attendanceModal: { show: false },
      isMentor: true,
    };

    this.githubRepo = this.props.githubRepo;
    this.authRepo = this.props.authRepo;
    this.studentRepo = this.props.studentRepo;
    this.city = this.props.match.params.city;
  }

  componentDidMount() {
    let { history } = this.props;

    this.setState({
      isLoading: true,
    });

    let defaultSchool = this.city;
    if (defaultSchool != null) {
      this.setSchool(defaultSchool);
    }

    this.authRepo.registerOnAuthListener(
      (user) => {
        if (user) {
          this.githubRepo.setToken().then((u) => {
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
      (error) => {
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
    return cityConfig.filter((city) => {
      return city.name.toLowerCase() === schoolName.toLowerCase();
    })[0];
  }

  onStudentClicked(studentName) {
    this.githubRepo.getStudent(studentName).then((student) => {
      console.log(student.data);
      this.setState({
        studentModal: { show: true, student: student.data },
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

  showAttendanceModal() {
    this.setState({
      attendanceModal: {
        show: true,
      },
    });
  }

  showLeaveNoteModal(login) {
    this.setState({
      leaveNoteModal: {
        show: true,
        studentName: login,
      },
    });
  }

  showUpdateAttendanceModal(login) {
    this.setState({
      updateAttendanceModal: {
        show: true,
        studentName: login,
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
            {this.state.isMentor === true ? (
              <div>
                <StudentModal
                  student={this.state.studentModal.student}
                  githubRepo={this.githubRepo}
                  school={this.state.school}
                  showModal={this.state.studentModal.show}
                  pullRequestData={this.state.data}
                  studentRepo={this.studentRepo}
                  onUpdateAttendanceClicked={(studentName) => {
                    this.showUpdateAttendanceModal(studentName);
                  }}
                  onLeaveNoteClicked={(studentName) => {
                    this.showLeaveNoteModal(studentName);
                  }}
                  closeModal={() => {
                    this.setState({
                      studentModal: {
                        show: false,
                        student: {},
                      },
                    });
                  }}
                />
                <SetAttendanceModal
                  studentName={this.state.updateAttendanceModal.studentName}
                  showModal={this.state.updateAttendanceModal.show}
                  studentRepo={this.studentRepo}
                  closeModal={() => {
                    this.setState({
                      updateAttendanceModal: {
                        show: false,
                      },
                    });
                  }}
                />
                <LeaveNoteModal
                  studentName={this.state.leaveNoteModal.studentName}
                  showModal={this.state.leaveNoteModal.show}
                  studentRepo={this.studentRepo}
                  closeModal={() => {
                    this.setState({
                      leaveNoteModal: {
                        show: false,
                      },
                    });
                  }}
                />
                {this.state.school === undefined ? null : (
                  <div>
                    <ReviewClassModal
                      school={this.state.school}
                      showModal={this.state.reviewClassModal.show}
                      studentRepo={this.studentRepo}
                      closeModal={() => {
                        this.setState({
                          reviewClassModal: {
                            show: false,
                          },
                        });
                      }}
                    />
                    <AttendanceModal
                      school={this.state.school}
                      showModal={this.state.attendanceModal.show}
                      studentRepo={this.studentRepo}
                      closeModal={() => {
                        this.setState({
                          attendanceModal: {
                            show: false,
                          },
                        });
                      }}
                    />
                    <div className="container">
                      <div className="card border-0 shadow my-4">
                        <div className="card-body p-4">
                          <h1 className="font-weight-light">
                            Welcome to the <b>{this.state.school.name}</b>{" "}
                            Student Tracker
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <div className="card border-0 shadow my-4">
                        <div className="card-body p-4">
                          <h1 className="font-weight-light">Class Actions</h1>

                          <button
                            type="button"
                            className="btn btn-primary btn-lg"
                            onClick={() => {
                              this.showReviewClassModal();
                            }}
                          >
                            Report on Whole Class
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary btn-lg ml-2"
                            onClick={() => {
                              this.showAttendanceModal();
                            }}
                          >
                            Report Attendance
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
