import React from "react";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import ModuleConfig from "../config/ModuleConfig";

class AttendanceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      students: {},
      school: {},
    };
  }

  componentDidMount() {
    Modal.setAppElement("#root");
    this.props.studentRepo
      .getStudentsFromSchool(this.props.school.name)
      .then((querySnapshot) => {
        this.setState({ data: querySnapshot.docs });
      });
  }

  closeModal() {
    if (Object.keys(this.state.students).length === 0) {
      this.props.closeModal();
    } else {
      var result = window.confirm(
        "Are you sure you want to close this screen? Everything will be lost."
      );
      if (result) {
        this.props.closeModal();
      }
    }
  }

  handleChange(studentName, contents) {
    let state = { students: {} };
    state.students[studentName] = {};
    state.students[studentName].noteValue = contents;
    this.setState(state);
  }

  submitAttended() {
    if (this.state.week === undefined) {
      window.alert("You must choose a week from this list on the right.");
      return;
    }

    this.setState({ loading: true });

    let promises = this.state.data.map((doc) => {
      let githubName = doc.data().githubName;
      let studentName = doc.data().name;
      let attended =
        this.state.students[studentName] === undefined
          ? undefined
          : this.state.students[studentName].attended;

      return this.props.studentRepo
        .postAttendanceForWeek(githubName, "", attended, this.state.week)
        .then(() => {
          console.log("Note Posted");
        });
    });

    Promise.all(promises).then((result) => {
      this.props.closeModal();
    });
  }

  getStudentLine(doc) {
    let studentName = doc.data().name;

    return (
      <div className="w-100 p-3" key={"quill" + studentName}>
        <h3>{doc.data().name}</h3>
        {this.getAttendanceDropdown(studentName)}
      </div>
    );
  }

  getAttendanceDropdown(studentName) {
    return (
      <div className="dropdown" id="attended">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {this.state.students[studentName] === undefined
            ? "Select Attendance"
            : this.state.students[studentName]}
        </button>
        <div
          class="dropdown-menu scrollable-menu"
          aria-labelledby="dropdownMenuButton"
        >
          {["Yes", "Late", "No"].map((attended) => {
            return (
              <div
                className="dropdown-item"
                onClick={() => {
                  let state = {};
                  state.students = [];
                  state.students[studentName] = attended;
                  this.setState(state);
                }}
              >
                {attended}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  getWeekDropdown() {
    return (
      <div className="dropdown w-100 mt-2" id="week">
        <button
          className="btn btn-secondary btn-lg dropdown-toggle w-100"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {this.state.week === undefined ? "Select Week" : this.state.week}
        </button>
        <div
          className="dropdown-menu scrollable-menu"
          aria-labelledby="dropdownMenuButton"
        >
          {ModuleConfig.map((week) => {
            return (
              <div
                className="dropdown-item"
                onClick={() => {
                  this.setState({ week: week });
                }}
              >
                {week}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  getSubmitButton() {
    return (
      <button
        type="button"
        className="btn btn-primary btn-lg w-100"
        onClick={() => {
          this.submitAttended();
        }}
      >
        {this.state.loading ? (
          <span
            class="spinner-border spinner-border-sm mr-2"
            role="status"
            aria-hidden="true"
          ></span>
        ) : null}
        Submit
      </button>
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
            <div className="col-10 rightRuleColumn">
              {this.state.data.map((doc) => {
                return this.getStudentLine(doc);
              })}
            </div>
            <div className="col-2">
              {this.getSubmitButton()}
              {this.getWeekDropdown()}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withRouter(AttendanceModal);
