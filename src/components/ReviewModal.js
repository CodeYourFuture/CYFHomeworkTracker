import React from "react";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import Popover from "react-tiny-popover";
import ReactMarkdown from "react-markdown/with-html";
import RepoContentsComponent from "./RepoContentsComponent.js";

class ReviewModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    Modal.setAppElement("#root");
  }

  closeModal() {
    this.props.closeModal();
  }

  copyToClipboard(pullNumber) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = this.getGitCommand(pullNumber);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  getGitCommand(pullNumber) {
    return `git fetch origin "+pull/${pullNumber}/head:pull/${pullNumber}/head" && git checkout "refs/heads/pull/${pullNumber}/head"`;
  }

  getGitCommandButton() {
    return (
      <Popover
        isOpen={this.state["isGitPopoverOpen" + this.props.pullRequest.number]}
        position={"top"}
        content={
          <div className="card shadow my-1">
            <div className="card-body p-2">
              <p>Copied to clipboard!</p>
              <p>Paste into a terminal to retrieve pull request.</p>
            </div>
          </div>
        }
        onClickOutside={() => {
          let state = {};
          state["isGitPopoverOpen" + this.props.pullRequest.number] = false;
          this.setState(state);
        }}
      >
        <div
          className="btn btn-primary m-1 min-200"
          onClick={() => {
            this.copyToClipboard(this.props.pullRequest.number);
            let state = {};
            state["isGitPopoverOpen" + this.props.pullRequest.number] = true;
            this.setState(state);
          }}
        >
          Copy Git Pull Command
        </div>
      </Popover>
    );
  }

  getViewSourceButton() {
    return (
      <a
        className="btn btn-primary m-1 min-200"
        href={"https://www.gitpod.io/#" + this.props.pullRequest.html_url}
        role="button"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Source Online
      </a>
    );
  }

  getViewStudentButton() {
    return (
      <div
        className="btn btn-primary m-1 min-200"
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          this.props.onViewStudentClicked(
            this.props.pullRequest.head.user.login
          );
        }}
      >
        View Student
      </div>
    );
  }

  getFeedbackButton() {
    return (
      <a
        className="btn btn-primary m-1 min-200"
        href={"https://www.gitpod.io/#" + this.props.pullRequest.html_url}
        role="button"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Source Online
      </a>
    );
  }

  getOpenPullRequestButton() {
    return (
      <a
        className="btn btn-primary m-1 min-200 btn-lg"
        href={this.props.pullRequest.html_url}
        role="button"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Pull Request
      </a>
    );
  }

  getGradeButton() {
    return (
      <a
        className="btn btn-primary m-1 min-200 btn-lg"
        href={this.props.school.tracker}
        target="_blank"
        rel="noopener noreferrer"
      >
        Give Feedback
      </a>
    );
  }

  getGradeForWorkButton() {
    return (
      <div
        className="btn btn-primary m-1 min-200"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          this.props.onGiveGradeClicked(this.props.pullRequest.head.user.login);
        }}
      >
        Give Grade
      </div>
    );
  }

  getPullBody() {
    return this.props.pullRequest.body.replace(/\n/gi, "\n\n");
  }

  render() {
    const customStyles = {
      content: {
        backgroundColor: "#fff",
        borderRadius: 5,
        maxWidth: 1000,
        minHeight: 300,
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
        contentLabel="Example Modal"
      >
        {this.props.showModal === true ? (
          <div className="container">
            <div className="card-body p-3">
              <h1 className="font-weight-light">
                {this.props.pullRequest.title}
              </h1>
              <div className="row">
                <div className="col-9 rightRuleColumn">
                  <div className="code">
                    <ReactMarkdown
                      source={this.getPullBody()}
                      escapeHtml={false}
                    />
                  </div>
                  <RepoContentsComponent
                    pull={this.props.pullRequest}
                    token={this.props.token}
                  />
                </div>
                <div className="col-3">
                  {this.getOpenPullRequestButton()}
                  {this.getGradeButton()}
                  <hr />
                  {this.getGitCommandButton()}
                  {this.getViewSourceButton()}
                  {this.getViewStudentButton()}
                  {this.getGradeForWorkButton()}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    );
  }
}

export default withRouter(ReviewModal);
