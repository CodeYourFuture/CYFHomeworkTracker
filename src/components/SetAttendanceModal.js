import React from "react";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import ModuleConfig from "../config/ModuleConfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

class SetAttendanceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    Modal.setAppElement("#root");
  }

  closeModal() {
    if (this.state.noteValue === undefined) {
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

  handleNoteChange(content) {
    this.setState({ noteValue: content });
  }

  onSubmit() {
    this.setState({ loading: true });

    this.props.studentRepo
      .postAttendanceForWeek(
        this.props.studentName,
        this.state.noteValue,
        this.state.attended,
        this.state.week
      )
      .then(() => {
        this.props.closeModal();
      });
  }

  getWeekDropdown() {
    return (
      <div className="dropdown" id="week">
        <button
          className="btn btn-secondary dropdown-toggle"
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

  getAttendanceDropdown() {
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
          {this.state.attended === undefined
            ? "Select Attendance"
            : this.state.attended}
        </button>
        <div
          className="dropdown-menu scrollable-menu"
          aria-labelledby="dropdownMenuButton"
        >
          {["Yes", "Late", "No"].map((attended) => {
            return (
              <div
                className="dropdown-item"
                onClick={() => {
                  this.setState({ attended: attended });
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

  render() {
    const customStyles = {
      content: {
        backgroundColor: "#fff",
        borderRadius: 5,
        maxWidth: 600,
        maxHeight: 600,
        margin: "0 auto",
        padding: 30,
      },
    };

    return (
      <Modal
        isOpen={this.props.showModal}
        style={customStyles}
        onRequestClose={() => {
          this.closeModal();
        }}
        contentLabel="Give Grade Modal"
      >
        {this.props.showModal === true ? (
          <div className="container">
            <div className="card-body p-3">
              <form>
                <h1 className="font-weight-light">Update Attendance</h1>
                <h2 className="font-weight-light">{this.props.studentName}</h2>
                <hr />
                <label for="week">Week</label>
                {this.getWeekDropdown()}
                <label for="grade">Attended?</label>
                {this.getAttendanceDropdown()}
                <label for="notes">Notes</label>
                <ReactQuill
                  className="w-100"
                  theme="snow"
                  type="text"
                  value={this.state.noteValue}
                  onChange={(content, delta, source, editor) => {
                    this.handleNoteChange(content);
                  }}
                />
                <hr />
                <div
                  className="btn btn-primary m-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  type="submit"
                  onClick={() => {
                    this.onSubmit();
                  }}
                >
                  {this.state.loading ? (
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  Submit Attendance
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </Modal>
    );
  }
}

export default withRouter(SetAttendanceModal);
