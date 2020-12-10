import React from "react"
import { FaAddressCard, FaArrowLeft, FaBroom, FaEnvelope, FaKey, FaSave, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { Card, Form, LoaderWrapper, Loader, Main, Title } from "../../components"
import Input from "../../components/fieldset-input"
import Warning from "../../components/warning"
import api from "../../services/api"
import { signIn } from "../../services/auth"

class RegisterUser extends React.Component {
    state = {
        email: "",
        registry: "",
        name: "",
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

        this.setState({ loading: true })

        const { email, registry, name, password, repeatPassword } = this.state

        if (email && registry && name && password && repeatPassword) {
            if (password === repeatPassword) {
                try {
                    await api.post("/user", { email, registry, name, password, repeatPassword })

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

                    document.getElementById("repeatPassword").focus()
                }
            } else {
                this.setState({ warning: "As senhas não coincidem.", loading: false })
            }
        } else {
            this.setState({ warning: "Preencha todos os campos.", loading: false })

            document.getElementById("name").focus()
        }
    }

    render() {
        return (
            <Main login>
                <section>
                    <Card className="lx-card">
                        <Form login onSubmit={this.handleSubmit}>
                            <Title>Criar Conta</Title>

                            <Input id="name" label="Nome" icon={<FaUser />} helper="Seu nome pode aparecer na plataforma, em suas contribuições ou onde é mencionado." placeholder="Lorem Ipsum" value={this.state.name} onChange={this.handleChange} required />

                            <Input id="registry" label="Matrícula" icon={<FaAddressCard />} placeholder="000000" value={this.state.registry} onChange={this.handleChange} required />

                            <Input id="email" label="E-mail" icon={<FaEnvelope />} placeholder="lorem@ipsum.com" value={this.state.email} onChange={this.handleChange} required />

                            <Input type="password" id="password" label="Senha" icon={<FaKey />} placeholder="pass123*" value={this.state.password} onChange={this.handleChange} required />

                            <Input type="password" id="repeatPassword" label="Confirme sua senha" icon={<FaKey />} placeholder="pass123*" value={this.state.repeatPassword} onChange={this.handleChange} required />

                            <div className="actions">
                                <button className="lx-btn save"><FaSave />&nbsp;&nbsp;Salvar</button>

                                <button className="lx-btn cancel"><FaBroom />&nbsp;&nbsp;Limpar</button>

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

export default RegisterUser
