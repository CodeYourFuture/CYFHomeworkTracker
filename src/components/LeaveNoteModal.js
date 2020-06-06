import React from "react";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

class LeaveNoteModal extends React.Component {
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
      .postStudentNote(this.props.studentName, this.state.noteValue)
      .then(() => {
        this.props.closeModal();
      });
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
                <h1 className="font-weight-light">Leave Note</h1>
                <h2 className="font-weight-light">{this.props.studentName}</h2>
                <hr />
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
                  Submit Note
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </Modal>
    );
  }
}

export default withRouter(LeaveNoteModal);
