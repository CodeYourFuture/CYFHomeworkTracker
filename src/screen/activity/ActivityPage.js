import React from "react";
import "../../main.css";
import { withRouter } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import cityConfig from "../../config/CityConfig.js";

class ActivityPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.githubRepo = this.props.githubRepo;
    this.authRepo = this.props.authRepo;
    this.studentRepo = this.props.studentRepo;

    this.city = this.props.match.params.city;
  }

  componentDidMount() {
    let { history } = this.props;
    this.history = history;

    let defaultSchool = this.city;
    if (defaultSchool != null) {
      this.setState({
        school: this.getSchoolFromName(defaultSchool),
      });
    }

    this.authRepo.registerOnAuthListener(
      (user) => {
        if (!user) {
          history.push(process.env.PUBLIC_URL + "/login");
        }
      },
      () => {
        history.push(process.env.PUBLIC_URL + "/login");
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSchoolFromName(schoolName) {
    return cityConfig.filter((city) => {
      return city.name.toLowerCase() === schoolName.toLowerCase();
    })[0];
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-2">
            <Sidebar
              school={this.state.school}
              history={this.history}
              currentCity={this.city}
            />
          </div>
          <div className="background-body col-10">
            <div className="container">
              <div className="card border-0 shadow my-4">
                <div className="card-body p-1">
                  <iframe
                    title="activity"
                    width="100%"
                    height="1000"
                    src="https://datastudio.google.com/embed/reporting/a5608cf7-981e-402e-9226-488687f2eb27/page/6zXD"
                    frameborder="0"
                    style={{ border: 0 }}
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ActivityPage);
