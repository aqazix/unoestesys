import React from "react"
import { FaArrowRight, FaEnvelope, FaKey, FaUserPlus } from "react-icons/fa"
import { Link } from "react-router-dom"
import { Card, Form, LoaderWrapper, Loader, Main, Text, Title } from "../../components"
import Input from "../../components/fieldset-input"
import Warning from "../../components/warning"
import api from "../../services/api"
import { signIn } from "../../services/auth"

class Login extends React.Component {
    state = {
        email: "",
        password: "",
        loading: false,
        warning: ""
    }

    handleAuthenticate = async e => {
        e.preventDefault()

        this.setState({ loading: true })

        const { email, password } = this.state

        if (email && password) {
            try {
                const { email, password } = this.state

                const response = await api.post("/login", { email, password })

                if (response.data.auth) {
                    signIn(response.data.token)

                    this.setState({ loading: false })

                    this.props.authenticate(true)

                    this.props.history.push("/home")
                }
            } catch (error) {
                this.setState({ warning: error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.", loading: false})

                setTimeout(() => {
                    this.setState({ warning: "" })
                }, 3100)
            }
        } else {
            this.setState({ warning: "Preencha todos os campos.", loading: false })

            document.getElementById("email").focus()

            setTimeout(() => {
                this.setState({ warning: "" })
            }, 3100)
        }
    }

    render() {
        return (
            <Main login>
                <section>
                    <Card className="lx-card">
                        <Form login onSubmit={this.handleAuthenticate}>
                            <Title>Fazer Login</Title>

                            <Input type="email" id="email" label="E-mail" icon={<FaEnvelope />} placeholder="lorem@ipsum.com" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} required />

                            <Input type="password" id="password" label="Senha" icon={<FaKey />} placeholder="loremipsum" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} required />

                            <Text login>
                                <p>
                                    <Link to="/recover-password">Esqueceu sua senha?</Link>
                                </p>
                            </Text>

                            <div className="actions">
                                <button className="lx-btn save" onClick={this.handleAuthenticate}>Entrar&nbsp;&nbsp;<FaArrowRight /></button>

                                <Link to="/register-user" className="lx-btn save">Criar uma conta&nbsp;&nbsp;<FaUserPlus /></Link>
                            </div>
                        </Form>
                    </Card>
                </section>

                {this.state.loading && <LoaderWrapper><Loader /></LoaderWrapper>}

                <Warning warning={this.state.warning} />
            </Main>
        )
    }
}

export default Login