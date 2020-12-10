import React from "react"
import { FaBan, FaEdit, FaSave, FaTags } from "react-icons/fa"
import { Subtitle, Form, Text } from "../../../../components"
import Select from "../../../../components/fieldset-select"
import api from "../../../../services/api"

class Edit extends React.Component {
    state = {
        name: "",
        roles: [],
        role_id: 0
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = async e => {
        try {
            e.preventDefault()

            this.props.loading(true)

            const { user } = this.props
            const { id } = user

            const role_id = parseInt(this.state.role_id)

            await api.put("/user/updateRole", { id, role_id })

            user.role_id = role_id
            user.title = this.state.roles[this.state.roles.findIndex(role => role.value === role_id)].label

            this.props.change({ ...user })

            this.props.cancel(null)

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

            const { name, role_id } = this.props.user

            this.setState({ name, roles, role_id })

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
            <>
                <Subtitle><FaEdit />&nbsp;&nbsp;Editar função</Subtitle>
                <Form alignEnd onSubmit={this.handleSubmit}>
                    <div className="lx-row is-start">
                        <Text>{this.state.name}</Text>

                        {this.state.roles && <Select id="role_id" label="Função" icon={<FaTags />} options={this.state.roles} value={this.state.role_id} onChange={this.handleChange} required />}

                        <div className="lx-row">
                            <div className="actions">
                                <button type="submit" id="save" className="lx-btn"><FaSave />&nbsp;&nbsp;Atualizar</button>

                                <button type="button" id="cancel" className="lx-btn" onClick={() => this.props.cancel(null)}><FaBan />&nbsp;&nbsp;Cancelar</button>
                            </div>
                        </div>
                    </div>
                </Form>
            </>
        )
    }
}

export default Edit