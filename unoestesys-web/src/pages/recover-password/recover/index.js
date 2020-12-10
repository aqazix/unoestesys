import React from "react"
import { FaArrowLeft, FaArrowRight, FaKey } from "react-icons/fa"
import { Link } from "react-router-dom"
import { Card, Form, LoaderWrapper, Loader, Main, Title } from "../../../components"
import Input from "../../../components/fieldset-input"
import Warning from "../../../components/warning"
import api from "../../../services/api"

class Recover extends React.Component {
    state = {
        password: "",
        repeatPassword: "",
        loading: false,
        warning: ""
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = async e => {
        e.preventDefault()

        try {
            this.setState({ loading: true })

            const { password, repeatPassword } = this.state

            if (password && repeatPassword) {
                if (password !== repeatPassword) {
                    const [, , token] = window.location.pathname.split("/")

                    await api.put("/user/recover/" + token, { password })

                    this.props.history.push("/")

                    this.setState({ loading: false })
                } else {
                    this.setState({ warning: "As senhas não coincidem.", loading: false })

                    document.getElementById("repeatPassword").focus()
                }
            } else {
                this.setState({ warning: "Preencha todos os campos.", loading: false })

                document.querySelector(".warning-popup").classList.add("is-active")

                setTimeout(() => {
                    document.querySelector(".warning-popup").classList.remove("is-active")
                }, 3000)

                document.getElementById("password").focus()
            }
        } catch (error) {
            this.setState({ warning: error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.", loading: false})

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
                        <Form login onSubmit={this.handleSubmit}>
                            <Title>Recupere sua senha</Title>

                            <Input type="password" id="password" label="Senha" icon={<FaKey />} placeholder="********" value={this.state.password} onChange={this.handleChange} required />

                            <Input type="password" id="repeatPassword" label="Confirme sua senha" placeholder="********" icon={<FaKey />} value={this.state.repeatPassword} onChange={this.handleChange} required />

                            <div className="actions">
                                <button className="lx-btn save">Recuperar&nbsp;&nbsp;<FaArrowRight /></button>

                                <Link to="/" className="lx-btn clear"><FaArrowLeft />&nbsp;&nbsp;Voltar</Link>
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

export default Recover