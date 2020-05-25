import React from "react";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

class ReviewClassModal extends React.Component {
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
    this.props.closeModal();
  }

  handleChange(studentName, contents) {
    console.log(contents);

    let state = { students: {} };
    state.students[studentName] = {};
    state.students[studentName].noteValue = contents;
    this.setState(state);
  }

  submitNotes() {
    this.state.data.forEach((doc) => {
      let githubName = doc.data().githubName;
      let studentName = doc.data().name;
      let noteValue =
        this.state.students[studentName] === undefined
          ? undefined
          : this.state.students[studentName].noteValue;

      if (noteValue !== undefined) {
        this.props.studentRepo
          .postStudentNote(githubName, noteValue)
          .then(() => {
            console.log("Note Posted");
          });
      }
    });
  }

  getStudentLine(doc) {
    let studentName = doc.data().name;
    let noteValue =
      this.state.students[studentName] === undefined
        ? ""
        : this.state.students[studentName].noteValue;

    return (
      <div className="w-100 p-3" key={"quill" + studentName}>
        <h3>{doc.data().name}</h3>
        <ReactQuill
          className="w-100"
          theme="snow"
          type="text"
          value={noteValue}
          onChange={(content, delta, source, editor) => {
            this.handleChange(studentName, content);
          }}
        />
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
        <div className="w-100">
          {this.state.data.map((doc) => {
            return this.getStudentLine(doc);
          })}
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              this.submitNotes();
            }}
          >
            Submit
          </button>
        </div>
      </Modal>
    );
  }
}

export default withRouter(ReviewClassModal);
