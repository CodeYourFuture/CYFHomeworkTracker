import React from "react";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };

    let { history } = this.props;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.authRepo = this.props.authRepo;
    this.authRepo.registerOnAuthListener(
      (user) => {
        if (user) {
          history.push(process.env.PUBLIC_URL + "/");
          console.log("hello");
        }
      },
      () => {},
      (error) => {
        console.log(error);
      }
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value,
    });
  }

  handleSubmit(event) {
    this.setState({ loading: true });
    event.preventDefault();
    this.authRepo.doSignInWithGithub((error) => {
      this.showToast("Something went wrong. Call Chris.");
      this.setState({ loading: false });
    });
  }

  showToast(message) {
    toast(message, {
      autoClose: 2000,
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row no-gutter">
          <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
          <div className="col-md-8 col-lg-6 white-background">
            <div className="login d-flex align-items-center py-5">
              <div className="container">
                <div className="row">
                  <div className="col-md-9 col-lg-8 mx-auto">
                    <h3 className="login-heading mb-4">
                      Welcome to the CodeYourFuture Homework Tracker
                    </h3>
                    <form>
                      <button
                        className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                        type="submit"
                        onClick={this.handleSubmit}
                      >
                        Sign in with Github
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginScreen);
