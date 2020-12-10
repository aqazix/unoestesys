import React from "react"
import { FaArrowLeft, FaArrowRight, FaEnvelope } from "react-icons/fa"
import { Link } from "react-router-dom"
import { Card, Form, LoaderWrapper, Loader, Main, Title, Text } from "../../components"
import Input from "../../components/fieldset-input"
import Warning from "../../components/warning"
import api from "../../services/api"

class RecoverPassword extends React.Component {
    state = {
        email: ""
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = async e => {
        e.preventDefault()

        try {
            this.setState({ loading: true })

            const { email } = this.state

            if (email) {
                await api.post("/user/sendRecover", { email })

                this.props.history.push("/")
            } else {
                document.getElementById("email").focus()

                this.setState({ warning: "Informe um e-mail.", loading: false })
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

                            <Text>
                                <p>
                                    Digite abaixo seu e-mail e enviaremos um e-mail de recuperação.
                                </p>
                            </Text>

                            <Input id="email" label="E-mail" icon={<FaEnvelope />} placeholder="lorem@ipsum.com" value={this.state.email} onChange={this.handleChange} required />

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

export default RecoverPassword