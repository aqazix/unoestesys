import React from "react"
import { FaAddressCard, FaBroom, FaEnvelope, FaSave, FaTags, FaUser } from "react-icons/fa"
import { Form } from "../../../components"
import Input from "../../../components/fieldset-input"
import Select from "../../../components/fieldset-select"
import api from "../../../services/api"

class Create extends React.Component {
    state = {
        email: "",
        name: "",
        registry: "",
        role_id: 0,
        roles: []
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = async e => {
        e.preventDefault()

        this.props.loading(true)

        const { email, name, registry, role_id } = this.state

        if (email && name && registry) {
            try {
                await api.post("/user/manage", { email, name, registry, role_id })

                document.querySelector("form").reset()

                this.setState({ email: "", name: "", registry: "", role_id: this.state.roles[0].value })

                this.props.loading(false)
            } catch (error) {
                const status = error.response ? error.response.status : 401

                if (status !== 401) {
                    this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")

                    document.getElementById("name").focus()

                    this.props.loading(false)
                } else {
                    this.props.history.push("/home")
                }
            }
        } else {
            this.props.warning("Preencha todos os campos.")

            document.querySelector(".warning-popup").classList.add("is-active")

            setTimeout(() => {
                document.querySelector(".warning-popup").classList.remove("is-active")
            }, 3000)

            document.getElementById("name").focus()

            this.props.loading(false)
        }
    }

    async componentDidMount() {
        try {
            this.props.loading(true)

            let roles = await (await api.get("/role")).data

            roles = roles.map(role => {
                return {
                    value: role.id,
                    label: role.title
                }
            })

            this.setState({ role_id: roles[0].value, roles })

            this.props.loading(false)
        } catch (error) {
            console.log(error.response)
            const status = error.response ? error.response.status : 401

            if (status !== 401) {
                this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")

                this.props.loading(false)
            } else {
                this.props.history.push("/home")
            }
        }
    }

    render() {
        return (
            <Form alignEnd onSubmit={this.handleSubmit}>
                <div className="lx-row is-start">
                    <Input id="name" label="Nome" icon={<FaUser />} placeholder="Lorem Ipsum" value={this.state.name} onChange={this.handleChange} required />

                    <Input id="registry" label="Matrícula" icon={<FaAddressCard />} placeholder="000000" value={this.state.registry} onChange={this.handleChange} required />

                    <Input id="email" label="E-mail" icon={<FaEnvelope />} placeholder="lorem@ipsum.com" value={this.state.email} onChange={this.handleChange} required />

                    {this.state.roles.length > 0 && <Select id="role_id" label="Função" icon={<FaTags />} options={this.state.roles} value={this.state.role_id} onChange={this.handleChange} required />}

                    <div className="actions">
                        <button className="lx-btn save"><i className={<FaSave />}></i>&nbsp;&nbsp;Salvar</button>

                        <button className="lx-btn cancel"><i className={<FaBroom />}></i>&nbsp;&nbsp;Limpar</button>
                    </div>
                </div>
            </Form>
        )
    }
}

export default Create