import React from "react";
import "../../main.css";
import HomeworkTable from "../../components/HomeworkTable";
import homeworkRepos from "../../config/HomeworkRepositories.js";
import cityConfig from "../../config/CityConfig.js";
import { withRouter } from "react-router-dom";
import cookie from "react-cookies";
import ReviewModal from "../../components/ReviewModal";
import OnboardingModal from "../../components/OnboardingModal";
import Sidebar from "../../components/Sidebar";

class HomeworkPage extends React.Component {
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
    this.history = history;

    this.setState({
      isLoading: true
    });

    let defaultSchool = this.city;
    if (defaultSchool != null) {
      this.setState({
        school: this.getSchoolFromName(defaultSchool)
      });
    }

    this.authRepo.registerOnAuthListener(
      user => {
        if (user) {
          this.githubRepo.setToken().then(u => {
            this.loadHomeworkRepos();
            this.setStudentFromParams();
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

  setStudentFromParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const student = urlParams.get("student");
    if (student !== null) {
      this.onStudentClicked(student);
    }
  }

  loadHomeworkRepos() {
    this.githubRepo.getAllHomeworkToReview(homeworkRepos).then(pulls => {
      this.setState({
        isLoading: false,
        data: pulls
      });
    });
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

  getDataForSchool(school) {
    return this.state.data.filter(homework => {
      if (school.name === "All") {
        return true;
      } else {
        return school.students.includes(homework.user.login);
      }
    });
  }

  hideOnboarding() {
    cookie.save("onboardingShown", false, { path: "/" });
    this.setState({ showOnboarding: false });
  }

  showOnboarding() {
    cookie.save("onboardingShown", true, { path: "/" });
    this.setState({ showOnboarding: true });
  }

  onStudentClicked(studentName) {
    this.githubRepo.getStudent(studentName).then(student => {
      console.log(student.data);
      this.setState({
        studentModal: { show: true, student: student.data }
      });
    });
  }

  onReviewClicked(pullRequest) {
    if (cookie.load("onboardingShown") === false) {
      this.showOnboarding();
    }

    this.setState({
      reviewModal: { show: true, pullRequest: pullRequest }
    });
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
            <ReviewModal
              showModal={this.state.reviewModal.show}
              pullRequest={this.state.reviewModal.pullRequest}
              token={this.githubRepo.getToken()}
              school={this.state.school}
              onViewStudentClicked={studentName => {
                console.log(studentName);
                this.onStudentClicked(studentName);
              }}
              closeModal={() => {
                this.setState({
                  reviewModal: {
                    show: false,
                    pullRequest: this.state.reviewModal.pullRequest
                  }
                });
              }}
            />
            {this.state.school === undefined ? null : (
              <div>
                <div className="container">
                  <div className="card border-0 shadow my-4">
                    <div className="card-body p-4">
                      <h1 className="font-weight-light text-center">
                        Welcome to the <b>{this.state.school.name}</b> Homework
                        Tracker
                      </h1>
                      <p className="lead">First time here? Need some tips?</p>
                      <div>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => this.showOnboarding()}
                        >
                          Show Onboarding
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container">
                  <div className="card border-0 shadow my-4">
                    <div className="card-body p-4">
                      <h1 className="font-weight-light text-center">
                        Remember to give a grade
                      </h1>
                      <p>
                        It's important that you give a grade on the students
                        homework so that we can track their development and
                        growth over the course.
                      </p>

                      <p>
                        You can find a guide on how grade homework{" "}
                        <a
                          href="https://docs.codeyourfuture.io/volunteers/education/homework-feedback#2-homework-grading"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          here
                        </a>
                      </p>

                      <p>Give feedback here:</p>

                      <div>
                        <a
                          className="btn btn-primary"
                          href={this.state.school.tracker}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Give Feedback
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container">
                  <HomeworkTable
                    isLoading={this.state.isLoading}
                    data={this.getDataForSchool(this.state.school)}
                    token={this.githubRepo.getToken()}
                    onReviewClicked={pullRequest => {
                      this.onReviewClicked(pullRequest);
                    }}
                    onStudentClicked={githubLogin => {
                      this.onStudentClicked(githubLogin);
                    }}
                  />
                </div>
                <OnboardingModal
                  hideOnboarding={() => {
                    this.hideOnboarding();
                  }}
                  showModal={this.state.showOnboarding}
                  school={this.state.school}
                  closeModal={() => {
                    this.setState({
                      showOnboarding: false
                    });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(HomeworkPage);
