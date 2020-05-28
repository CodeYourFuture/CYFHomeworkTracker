import React from "react";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";

class OnboardingModal extends React.Component {
  render() {
    const customStyles = {
      content: {
        backgroundColor: "#fff",
        borderRadius: 5,
        maxWidth: 1000,
        minHeight: 300,
        margin: "0 auto",
        padding: 30
      }
    };

    return (
      <Modal
        style={customStyles}
        isOpen={this.props.showModal}
        onRequestClose={() => {
          this.props.closeModal();
        }}
        contentLabel="Example Modal"
      >
        <div className="container">
          <div className="card-body p-5">
            <h1 className="font-weight-light">First Time Here?</h1>
            <p className="lead">
              Thank you for helping mark our students homework. Homework
              feedback provides the backbone of our tracking of our students
              progress and is vital in order to encourage growth and build
              confidence in our students.
            </p>
            <br />
            <hr />
            <h3 className="font-weight-light">1. Read the guide</h3>
            <p>
              The guide gives high level information and what we're trying to
              achieve with the feedback that we give and the steps required to
              fully mark the homework.
            </p>
            <p>
              You can read the full guide
              <a
                href="https://docs.codeyourfuture.io/volunteers/education/homework-feedback"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
            </p>
            <br />
            <hr />
            <h3 className="font-weight-light">2. Choose your city</h3>
            <p>
              In the previous screen you can select the school that you
              volunteer with. You are - of course - welcome to mark the homework
              of our any of our students but we suggest sticking to a single
              school to start off with.
            </p>
            <br />
            <hr />
            <h3 className="font-weight-light">3. Give feedback</h3>
            <p>On each of row of the table below you can find</p>
            <ul>
              <li>Information about the homework</li>
              <li>A link to view the source code in an online editor</li>
              <li>A link to the students pull request</li>
            </ul>
            <p>
              Peer review style feedback should be given to the student on their
              pull requests. Please read the guide above for full guidelines.
              You should make sure to tag the homework correctly when you have
              reviewed it.
            </p>
            <p>
              See
              <a
                href="https://docs.codeyourfuture.io/volunteers/education/homework-feedback#labelling-the-pull-request"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>{" "}
              for more information.
            </p>
            <br />
            <hr />
            <h3 className="font-weight-light">4. Give a grade</h3>
            <p>
              It is very important that when you finish giving feedback on a
              students homework that you record the results in the tracking
              spreadsheet. These are city specific and you can find the link to
              your cities in the card below.
            </p>
            <p>Hit the button to record grade.</p>
            <div className="text-center">
              <a
                className="btn btn-primary"
                href={this.props.school.tracker}
                target="_blank"
                rel="noopener noreferrer"
              >
                Record grade
              </a>
            </div>
            <br />
            <hr />
            <h3 className="font-weight-light">Questions?</h3>
            <p>Speak to your Class Coordinator or Chris Owen.</p>
            <hr />
            <button
              className="btn btn-danger float-right"
              onClick={() => this.props.hideOnboarding()}
            >
              Close Modal
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withRouter(OnboardingModal);
