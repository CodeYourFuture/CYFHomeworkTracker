import React from "react";
import { withRouter, Link } from "react-router-dom";
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
              <Link to="/">
                <button className="btn btn-info btn-lg w-100 mt-2">
                  <i className="fa fa-home ml-2"></i> Home
                </button>
              </Link>
            </div>
            <hr />
            <div>
              <button
                type="button"
                className="btn btn-primary btn-lg w-100 mt-5"
                onClick={() => {
                  this.goToHome();
                }}
              >
                <i class="fas fa-tachometer-alt"></i> Dashboard
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
                <i className="fa fa-book ml-2"></i> Homework
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
                <i className="fa fa-user-graduate ml-2"></i> Students
              </button>
            </div>
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
                {cityConfig.map(city => {
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
            <hr />
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(Sidebar);
