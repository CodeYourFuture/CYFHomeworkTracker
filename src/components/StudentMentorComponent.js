import React from "react";
import { withRouter } from "react-router-dom";
import cityConfig from "../config/CityConfig.js";

class StudentMentorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { educationAddShow: false, pdAddShow: false };
  }

  getAddBuddy(type) {
    return (
      <div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">
              Name
            </span>
          </div>
          <input
            type="text"
            class="form-control"
            aria-label="Name"
            aria-describedby="basic-addon1"
            onChange={(event) => {
              this.handleChange(event.target.value, type, "Name");
            }}
          />
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">
              Email
            </span>
          </div>
          <input
            type="text"
            class="form-control"
            aria-label="Email"
            aria-describedby="basic-addon1"
            onChange={(event) => {
              this.handleChange(event.target.value, type, "Email");
            }}
          />
        </div>
      </div>
    );
  }

  handleChange(content, type, field) {
    let state = {};
    state[type + field] = content;
    this.setState(state);
    console.log(this.state);
  }

  onAddBuddyClick(type) {
    if (type === "education") {
      if (this.state.educationAddShow) {
        this.props.studentRepo.addEducationBuddy(
          this.props.studentName,
          this.state.educationName,
          this.state.educationEmail
        );

        this.setState({ educationAddShow: false });
      } else {
        this.setState({ educationAddShow: true });
      }
    } else {
      if (this.state.pdAddShow) {
        this.props.studentRepo.addPersonalDevelopmentBuddy(
          this.props.studentName,
          this.state.pdName,
          this.state.pdEmail
        );
        this.setState({ pdAddShow: false });
      } else {
        this.setState({ pdAddShow: true });
      }
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm">
            <div className="card">
              <div className="card-header">Education Buddies</div>
              <ul className="list-group list-group-flush">
                {this.props.educationBuddies.map((buddy) => {
                  return <li className="list-group-item">{buddy.name}</li>;
                })}
                <li className="list-group-item">
                  {this.state.educationAddShow
                    ? this.getAddBuddy("education")
                    : null}

                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={() => {
                      this.onAddBuddyClick("education");
                    }}
                  >
                    Add Buddy <i class="fas fa-plus-square"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm">
            <div className="card">
              <div className="card-header">Personal Development Buddies</div>
              <ul className="list-group list-group-flush">
                {this.props.pdBuddies.map((buddy) => {
                  return <li className="list-group-item">{buddy.name}</li>;
                })}
                <li className="list-group-item">
                  {this.state.pdAddShow ? this.getAddBuddy("pd") : null}
                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={() => {
                      this.onAddBuddyClick("pd");
                    }}
                  >
                    Add Buddy <i class="fas fa-plus-square"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(StudentMentorComponent);
