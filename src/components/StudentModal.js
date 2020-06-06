import React from "react";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import ProjectSpecs from "../config/ProjectSpecs";
import cityConfig from "../config/CityConfig";
import StudentMentorComponent from "./StudentMentorComponent";

class StudentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      school: {},
      studentInfo: {},
      studentNotes: [],
      educationBuddies: [],
      pdBuddies: [],
    };
  }

  componentDidMount() {
    Modal.setAppElement("#root");
  }

  componentDidUpdate(prevProps) {
    if (this.props.student.name === undefined) {
      return;
    }

    if (prevProps.student.githubName === this.props.student.githubName) {
      return;
    }

    this.getAverageHomeworkScore();
    this.setState({
      school: this.getSchoolFromName(this.props.student.school),
    });

    this.props.studentRepo.getNotesForStudent(
      this.props.student.githubName,
      (data) => {
        this.setState(data);
      }
    );

    this.props.studentRepo.getEducationBuddiesForStudent(
      this.props.student.githubName,
      (data) => {
        this.setState(data);
      }
    );
  }

  getSchoolFromName(schoolName) {
    return cityConfig.filter((city) => {
      return city.name.toLowerCase() === schoolName.toLowerCase();
    })[0];
  }

  getProjectsOnline() {
    this.state.data.forEach((project, index) => {
      fetch(
        `https://cyf-${this.props.student.githubName}-${project.shortName}.netlify.com`
      )
        .then((data) => {
          project.success = data.status === 200;
          let projects = this.state.data;
          projects[index] = project;
          this.setState({ data: projects });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  getProjectDetails() {
    return ProjectSpecs.map((project) => {
      return project;
    });
  }

  getStudentName() {
    let name = this.props.student.name;

    if (name === undefined) {
      return "Loading...";
    }

    return this.toTitleCase(name);
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  closeModal() {
    this.props.closeModal();
  }

  getPullRequestsForStudent(username) {
    return this.props.pullRequestData.filter((pull) => {
      return pull.user.login === username;
    });
  }

  getAverageHomeworkScore() {
    this.props.studentRepo
      .getHomeworkForStudentByName(this.props.student.githubName)
      .then((result) => {
        let total = 0;

        result.forEach((homework) => {
          total += homework.result;
        });

        let average = (total / result.length).toFixed(2);

        this.setState({ averageHomeworkScore: average });
      });
  }

  getLeaveNoteButton() {
    return (
      <div
        className="btn btn-primary m-1 w-100"
        rel="noopener noreferrer"
        onClick={() => {
          this.props.onLeaveNoteClicked(this.props.student.githubName);
        }}
      >
        Leave Note
      </div>
    );
  }

  getUpdateAttendanceButton() {
    return (
      <div
        className="btn btn-primary m-1 w-100"
        rel="noopener noreferrer"
        onClick={() => {
          this.props.onUpdateAttendanceClicked(this.props.student.githubName);
        }}
      >
        Update Attendance
      </div>
    );
  }

  getStudentColumn(school) {
    return (
      <div>
        <h1 className="font-weight-light">{this.getStudentName()}</h1>
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
            href={"https://github.com/" + this.props.student.githubName}
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
        <hr />
        {this.getLeaveNoteButton()}
        {this.getUpdateAttendanceButton()}
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
        <h2 className="font-weight-light">Student Buddies</h2>
        <StudentMentorComponent
          educationBuddies={this.state.educationBuddies}
          pdBuddies={this.state.pdBuddies}
          studentGithubName={this.props.student.githubName}
          studentRepo={this.props.studentRepo}
        />
        <hr />
        <h2 className="font-weight-light">Student Record</h2>
        {this.state.studentInfo === undefined
          ? this.getLoading()
          : this.state.studentNotes.map((note) => {
              return (
                <div className="card mt-1" key={note.created}>
                  <div className="card-header">
                    {new Date(note.created).toLocaleString()}
                  </div>
                  <div className="card-body p-2">
                    <p
                      className="card-text"
                      dangerouslySetInnerHTML={{ __html: note.note }}
                    ></p>
                  </div>
                </div>
              );
            })}

        {/* <HomeworkTable
          onClick={(id) => {
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
