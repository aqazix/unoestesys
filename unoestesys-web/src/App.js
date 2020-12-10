// Dependencies
import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom"
import Global from "./components"
import Header from "./components/header"
import Footer from "./components/footer"
import Calendar from "./pages/calendar"
import ErrorPage from "./pages/error"
import Home from "./pages/home"
import Login from "./pages/login"
import ManageModule from "./pages/manage-module"
import ManageSubject from "./pages/manage-subject"
import ManageUser from "./pages/manage-user"
import RecoverPassword from "./pages/recover-password"
import Recover from "./pages/recover-password/recover"
import RegisterUser from "./pages/register-user"
import Schedule from "./pages/schedule"
import ManageCourse from "./pages/manage-course"
import Profile from "./pages/profile"
import { isAuthenticated } from "./services/auth"

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())

  const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
      <Route {...rest} render={props => authenticated ? (<Component {...props} />) : (<Redirect to={{ pathname: "/", state: { from: props.location } }} />)}
      />
    )
  }

  const PublicRoute = ({ component: Component, ...rest }) => {
    return (
      <Route {...rest} render={props => !authenticated ? (<Component {...props} />) : (<Redirect to={"/home"} />)} />
    )
  }

  useEffect(() => {
    setAuthenticated(isAuthenticated())
  }, [authenticated])

  return (
    <div className="App">
      <Global />
      <Router>
        <Header authenticated={authenticated} unaunthenticate={setAuthenticated} />
        <Switch>
          <PublicRoute exact path="/" component={props => <Login {...props} authenticate={setAuthenticated} />} />
          <PublicRoute exact path="/recover-password" component={props => <RecoverPassword {...props} />} />
          <PublicRoute path="/recover-password/:token" component={props => <Recover {...props} />} />
          <PublicRoute path="/register-user" component={props => <RegisterUser {...props} authenticate={setAuthenticated} />} />
          <PrivateRoute path="/calendar" component={props => <Calendar {...props} />} />
          <PrivateRoute path="/home" component={props => <Home {...props} authenticate={setAuthenticated} />} />
          <PrivateRoute path="/manage-course" component={props => <ManageCourse {...props} />} />
          <PrivateRoute path="/manage-module" component={props => <ManageModule {...props} />} />
          <PrivateRoute path="/manage-subject" component={props => <ManageSubject {...props} />} />
          <PrivateRoute path="/manage-user" component={props => <ManageUser {...props} />} />
          <PrivateRoute path="/profile" component={props => <Profile {...props} />} />
          <PrivateRoute path="/schedule" component={props => <Schedule {...props} />} />
          <Route exact path="*" component={ErrorPage} />
        </Switch>
      </Router>
      <Footer />
    </div>
  )
}

export default App
