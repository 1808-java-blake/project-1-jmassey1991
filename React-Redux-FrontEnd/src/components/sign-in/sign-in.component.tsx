import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ISignInState, IState } from '../../reducers';
import * as signInActions from '../../actions/sign-in/sign-in.actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { environment } from '../../environment';

interface IProps extends RouteComponentProps<{}>, ISignInState {
  updateError: (message: string) => any
  updatePassword: (password: string) => any,
  updateUsername: (username: string) => any,
  submit: (credentials: any) => any
}

class SignInComponent extends React.Component<IProps, {}> {

  constructor(props: any) {
    super(props);
  }


  public submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${environment.context}users/login`, {
      body: JSON.stringify(this.props.credentials),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(resp => {
        console.log(resp.status)
        if (resp.status === 401) {
          this.props.updateError('Invalid Credentials');
        } else if (resp.status === 200) {
          return resp.json();
        } else {
          this.props.updateError('Failed to Login at this time');
        }
        throw new Error('Failed to login');
      })
      .then(resp => {
        localStorage.setItem('user', JSON.stringify(resp));
        this.props.history.push('/home');
      })
      .catch(err => {
        console.log(err);
      });
  }
  public passwordChange = (e: any) => {
    this.props.updatePassword(e.target.value);
  }

  public usernameChange = (e: any) => {
    this.props.updateUsername(e.target.value);
  }


  public render() {
    const { errorMessage, credentials } = this.props;

    return (
      <div className="text-center signin-container bg-secondary">
      <form className="form-signin" onSubmit={this.submit}>
        <h1 id="pleaseHelpPoor" className="h3 mb-3 font-weight-normal">Please Help Poor</h1>

        <label htmlFor="inputUsername" className="sr-only">Username</label>
        <input
          onChange={this.usernameChange}
          value={credentials.username}
          type="text"
          id="inputUsername"
          className="form-control"
          placeholder="Username"
          required />

        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input
          onChange={this.passwordChange}
          value={credentials.password}
          type="password"
          id="inputPassword"
          className="form-control"
          placeholder="Password"
          required />

        <button id="signInButton" className="btn btn-lg btn-dark btn-block" type="submit">Sign in</button>
      </form>
      <Link id="registerLink" className="badge badge-light" to="/register">Register</Link>
      {errorMessage && <p id="error-message">{errorMessage}</p>}
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => (state.signIn);
const mapDispatchToProps = {
  updateError: signInActions.updateError,
  updatePassword: signInActions.updatePassword,
  updateUsername: signInActions.updateUsername,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInComponent);

