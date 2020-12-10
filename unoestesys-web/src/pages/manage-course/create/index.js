import React from "react"
import { FaBan, FaBroom, FaChalkboardTeacher, FaSave, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { Form } from "../../../components"
import Input from "../../../components/fieldset-input"
import Select from "../../../components/fieldset-select"
import api from "../../../services/api"

class Create extends React.Component {
    state = {
        coordinators: [],
        coordinator_id: 0,
        name: ""
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleClean = () => {
        document.querySelector("form").reset()

        this.setState({ coordinator_id: 0, name: "" })
    }

    handleSubmit = async e => {
        try {
            e.preventDefault()

            this.props.loading(true)

            const { coordinator_id, name } = this.state

            if (coordinator_id && name) {
                await api.post("/course", { name, coordinator_id })

                this.props.loading(false)

                this.setState({ coordinator_id: 0, name: "" })

                document.querySelector("#name").focus()
            } else {
                this.props.warning("Preencha todos os campos.")

                if (!name)
                    document.querySelector("#name").focus()

                if (!coordinator_id)
                    document.querySelector("#coordinator_id").focus()

                this.props.loading(false)
            }
        } catch (error) {
            const status = error.response ? error.response.status : 401

            if (status !== 401) {
                this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")

                this.props.loading(false)
            } else {
                this.props.history.push("/home")
            }
        }
    }

    async componentDidMount() {
        try {
            this.props.loading(true)

            let response = await (await api.get("/user?role_id=3")).data

            let coordinators = response.map(professor => {
                return {
                    value: professor.id,
                    label: professor.name
                }
            })

            this.setState({ coordinators })

            this.props.loading(false)
        } catch (error) {
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
                    <Input id="name" label="Nome" icon={<FaChalkboardTeacher />} placeholder="Ex: Gestão de T.I." value={this.state.name} onChange={this.handleChange} required />

                    <Select id="coordinator_id" label="Coordenador" icon={<FaUser />} options={this.state.coordinators} value={this.state.coordinator_id} onChange={this.handleChange} required />

                    <div className="lx-row">
                        <div className="actions">
                            <button type="submit" id="save" className="lx-btn"><FaSave />&nbsp;&nbsp;Criar</button>

                            <button type="button" id="clear" className="lx-btn" onClick={this.handleClean}><FaBroom />&nbsp;&nbsp;Limpar</button>

                            <Link to="/home" id="cancel" className="lx-btn"><FaBan />&nbsp;&nbsp;Cancelar</Link>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default Create