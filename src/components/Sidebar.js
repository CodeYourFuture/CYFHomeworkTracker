import React from "react";
import { withRouter } from "react-router-dom";
import cityConfig from "../config/CityConfig.js";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goToStudents(location = this.props.currentCity) {
    this.props.history.push(
      process.env.PUBLIC_URL + "/schools/" + location + "/students"
    );
  }

  goToHomework(location = this.props.currentCity) {
    this.props.history.push(
      process.env.PUBLIC_URL + "/schools/" + location + "/homework"
    );
  }

  goToHome(location = this.props.currentCity) {
    this.props.history.push(process.env.PUBLIC_URL + "/schools/" + location);
  }

  gotToActivity(location = this.props.currentCity) {
    this.props.history.push(
      process.env.PUBLIC_URL + "/schools/" + location + "/activity"
    );
  }

  getCurrentPage() {
    let location = this.props.location;
    let page = location.pathname.split("/");
    return page[page.length - 1];
  }

  render() {
    return (
      <div className="card sidebar">
        {this.props.school !== undefined ? (
          <div className="card-body p-3">
            <div>
              <button
                type="button"
                className="btn btn-primary btn-lg w-100 mt-5"
                onClick={() => {
                  this.goToHome();
                }}
              >
                Home
                <i className="fa fa-home ml-2"></i>
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary btn-lg w-100 mt-2"
                onClick={() => {
                  this.goToHomework();
                }}
              >
                Homework
                <i className="fa fa-book ml-2"></i>
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary btn-lg w-100 mt-2"
                onClick={() => {
                  this.goToStudents();
                }}
              >
                Students
                <i className="fa fa-user-graduate ml-2"></i>
              </button>
            </div>
            {this.props.currentCity === "London" ? (
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-lg w-100 mt-2"
                  onClick={() => {
                    this.gotToActivity();
                  }}
                >
                  Activity
                  <i className="fa fa-chart-line ml-2"></i>
                </button>
              </div>
            ) : null}
            <hr />
            <div className="btn-group w-100">
              <button
                className="btn btn-secondary btn-lg dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.props.school.name}
              </button>
              <div className="dropdown-menu">
                {cityConfig.map((city) => {
                  return (
                    <div
                      className="dropdown-item"
                      href="#"
                      key={city.name}
                      onClick={() => {
                        this.goToHome(city.name);
                      }}
                    >
                      {city.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(Sidebar);
