import React from "react";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import ProjectSpecs from "../config/ProjectSpecs";
import CityConfig from "../config/CityConfig";
import HomeworkTable from "../components/HomeworkTable";

class StudentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      data: ProjectSpecs,
      school: {}

    };
  }

  componentDidMount() {
    Modal.setAppElement("#root");
  }

  componentDidUpdate(prevProps) {
    if (this.props.student.name === undefined) {
      return;
    }

    if (prevProps.student.login === this.props.student.login) {
      return;
    }

    this.getAverageHomeworkScore();
    this.setState({
      school: this.getSchoolFromUsername(this.props.student.login)
    });

    this.props.studentRepo
      .getStudentDetailsByName(this.props.student.login)
      .then((student) => {
        student.ref
          .collection("notes")
          .get()
          .then((query) => {
            let data = query.docs.map((doc) => {
              return doc.data();
            });

            this.setState({
              studentInfo: student.data(),
              studentNotes: data,
            });
          });
      });
  }

  getProjectsOnline() {
    this.state.data.forEach((project, index) => {
      fetch(
        `https://cyf-${this.props.student.login}-${project.shortName}.netlify.com`
      )
        .then(data => {
          project.success = data.status === 200;
          let projects = this.state.data;
          projects[index] = project;
          this.setState({ data: projects });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  getProjectDetails() {
    return ProjectSpecs.map(project => {
      return project;
    });
  }

  getStudentName() {
    let name =
      this.props.student.name === null
        ? this.props.student.login
        : this.props.student.name;

    if (name === undefined) {
      return "Loading...";
    }

    return this.toTitleCase(name);
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  closeModal() {
    this.props.closeModal();
  }

  getSchoolFromUsername(username) {
    if (username === undefined) {
      return "Loading...";
    }

    let foundSchool;

    CityConfig.forEach(school => {
      if (school.students.includes(username)) {
        foundSchool = school;
      }
    });

    return foundSchool;
  }

  getPullRequestsForStudent(username) {
    return this.props.pullRequestData.filter(pull => {
      return pull.user.login === username;
    });
  }

  getAverageHomeworkScore() {

    this.props.studentRepo.getHomeworkForStudentByName(
      this.props.student.login,
      homeworkList => {
        let total = 0;

        homeworkList.forEach(homework => {

          total += homework.result;
        });

        let average = (total / result.length).toFixed(2);

        this.setState({ averageHomeworkScore: average });
      });
  }

  getStudentColumn(school) {
    return (
      <div className="text-center">
        <img
          className="align-self-start mr-3 rounded-circle"
          height="128"
          width="128"
          src={this.props.student.avatar_url}
          alt={this.getStudentName() + "'s Avatar"}
        />
        <h3 className="mt-0">{this.getStudentName()}</h3>
        <p>
          School: {school.name}
          <br />
          Student Tracker:{" "}
          <a href={school.tracker} target="_blank" rel="noopener noreferrer">
            Link
          </a>
          <br />
          Github Profile:{" "}
          <a
            href={this.props.student.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Link
          </a>
          <br />
        </p>
        <hr />
        <h3 className="font-weight-light">Average Score</h3>
        {this.state.averageHomeworkScore}
      </div>
    );
  }

  getLoading() {
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  getDetailsColumn() {
    return (
      <div className="container-fluid">

        <h2 className="font-weight-light">Open Pull Requests</h2>
        <HomeworkTable
          onClick={id => {

            this.onViewPullRequestClick(id);
          }}
          size={5}
          search={false}
          data={this.getPullRequestsForStudent(this.props.student.login)}
        /> */}
        {/* <ProjectTable
          data={this.getProjectDetails()}
          studentName={this.props.student.login}
        /> */}
      </div>
    );
  }

  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        onRequestClose={() => {
          this.closeModal();
        }}
        contentLabel="Example Modal"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-2 rightRuleColumn">
              {this.getStudentColumn(this.state.school)}
            </div>
            <div className="col-10">{this.getDetailsColumn()}</div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withRouter(StudentModal);
