import React from "react"
import { FaAdjust, FaBars, FaBook, FaCalendarAlt, FaChalkboardTeacher, FaHome, FaPuzzlePiece, FaSignOutAlt, FaToolbox, FaUser, FaUserEdit } from "react-icons/fa"
import { Link } from "react-router-dom"
import { HeaderElem } from "../index"
import logo from "../../assets/media/brand/brand-green.svg"
import { parseJWT } from "../../helpers"
import { signOut, isDarkMode, turnOn, turnOff, getToken } from "../../services/auth"

class Header extends React.Component {
    state = {
        authenticated: false,
        role_id: 0
    }

    handleSignOut = () => {
        signOut()
        this.props.unaunthenticate(false)
    }

    handleToggleDarkMode = () => {
        !isDarkMode() ? turnOn() : turnOff()
        document.querySelector("body").classList.toggle("dark")
    }

    handleToggleOffCanvas = () => {
        document.getElementById("nav-offcanvas").classList.toggle("is-active")
    }

    handleTogglePanel = () => {
        let panel = document.querySelector("header .panel")
        panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px"
    }

    componentDidMount() {
        if (isDarkMode())
            document.querySelector("body").classList.toggle("dark")

        if (this.props.authenticated) {
            const { role_id } = parseJWT(getToken())

            this.setState({ role_id })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.authenticated !== this.props.authenticated && this.props.authenticated) {
            const { role_id } = parseJWT(getToken())

            this.setState({ role_id })
        }
    }

    render() {
        return (
            <HeaderElem>
                <nav id="nav-top">
                    <Link to="/" className="brand">
                        <img src={logo} alt="Unoeste" />
                    </Link>

                    <div className="actions">
                        <button onClick={this.handleToggleDarkMode}><FaAdjust /></button>

                        {this.props.authenticated && <button onClick={this.handleToggleOffCanvas}><FaBars /></button>}
                    </div>
                </nav>

                {this.props.authenticated && <nav id="nav-offcanvas">
                    <Link to="/home"><FaHome />&nbsp;&nbsp;Página Inicial</Link>
                    {/* <Link to="" className="link"><i className="fas fa-file-contract"></i>&nbsp;&nbsp;Criar um contrato</Link> */}
                    <button onClick={this.handleTogglePanel}><FaToolbox />&nbsp;&nbsp;Gerenciar</button>
                    <div className="panel">
                        {this.state.role_id < 3 && <Link to="/manage-course" className="link"><FaChalkboardTeacher />&nbsp;&nbsp;Cursos</Link>}
                        {this.state.role_id < 3 && <Link to="/manage-subject" className="link"><FaBook />&nbsp;&nbsp;Disciplinas</Link>}
                        <Link to="/profile" className="link"><FaUser />&nbsp;&nbsp;Perfil</Link>
                        {/* <Link to="" className="link"><i className="fas fa-file-alt"></i>&nbsp;&nbsp;Formulários</Link> */}
                        {this.state.role_id < 3 && <Link to="/manage-module" className="link"><FaPuzzlePiece />&nbsp;&nbsp;Módulos</Link>}
                        {this.state.role_id === 1 && <Link to="manage-user" className="link"><FaUserEdit />&nbsp;&nbsp;Usuários</Link>}
                        <Link to="/schedule" className="link"><FaCalendarAlt />&nbsp;&nbsp;Webconferências</Link>
                    </div>
                    <button onClick={this.handleSignOut}><FaSignOutAlt />&nbsp;&nbsp;Sair</button>
                </nav>}
            </HeaderElem>
        )
    }
}

export default Header