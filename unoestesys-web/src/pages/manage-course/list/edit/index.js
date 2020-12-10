import React from "react"
import { FaBan, FaChalkboardTeacher, FaEdit, FaSave, FaUser } from "react-icons/fa"
import { Form, Subtitle } from "../../../../components"
import Input from "../../../../components/fieldset-input"
import Select from "../../../../components/fieldset-select"
import api from "../../../../services/api"

class Edit extends React.Component {
    state = {
        coordinators: [],
        coordinator_id: 0,
        name: ""
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = async e => {
        e.preventDefault()

        this.props.loading(true)

        let course = this.props.course
        course.coordinator_id = this.state.coordinator_id
        course.name = this.state.name

        const { coordinator_id, name } = this.state

        if (coordinator_id && name) {
            try {
                await api.put("/course", { ...course })

                this.props.loading(false)

                this.props.cancel()

                this.props.change({ coordinator_id, name })
            } catch (error) {
                const status = error.response ? error.response.status : 401

                if (status !== 401) {
                    this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")

                    this.props.loading(false)
                } else {
                    this.props.history.push("/home")
                }
            }
        } else {
            this.props.warning("Preencha todos os campos.")

            document.getElementById("name").focus()

            this.props.loading(false)
        }
    }

    async componentDidMount() {
        try {
            this.props.loading(true)

            const { coordinator_id, name } = this.props.course

            let response = await (await api.get("/user?role_id=3")).data

            let coordinators = response.map(professor => {
                return {
                    value: professor.id,
                    label: professor.name
                }
            })

            this.setState({ coordinators, coordinator_id, name })

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

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            const { coordinator_id, name } = this.props.course

            this.setState({ coordinator_id, name })
        }
    }

    render() {
        return (
            <>
                <Subtitle><FaEdit />&nbsp;&nbsp;Editar curso</Subtitle>
                <Form alignEnd onSubmit={this.handleSubmit}>
                    <div className="lx-row is-start">
                        <Input id="name" label="Nome" icon={<FaChalkboardTeacher />} value={this.state.name} onChange={this.handleChange} required />

                        <Select id="coordinator_id" label="Coordenador" icon={<FaUser />} options={this.state.coordinators} value={this.state.coordinator_id} onChange={this.handleChange} required />

                        <div className="lx-row">
                            <div className="actions">
                                <button type="submit" id="save" className="lx-btn"><FaSave />&nbsp;&nbsp;Alterar</button>

                                <button type="button" id="cancel" className="lx-btn" onClick={this.props.cancel}><FaBan />&nbsp;&nbsp;Cancelar</button>
                            </div>
                        </div>
                    </div>
                </Form>
            </>
        )
    }
}

export default Edit