import React from "react"
import { FaAddressCard, FaEdit, FaTags, FaTrash, FaUser } from "react-icons/fa"
import Edit from "./edit"
import ErrorBoundary from "../../../components/error-boundary"
import api from "../../../services/api"

class List extends React.Component {
    state = {
        edit: null,
        users: []
    }

    changeUser = user => {
        let users = this.state.users.slice()
        users[users.findIndex(elem => elem.id === user.id)] = user

        this.setState({ users })
    }

    changeEdit = edit => {
        this.setState({ edit })
    }

    handleDelete = async id => {
        try {
            this.props.loading(true)

            await api.delete("/user/" + id)

            let users = this.state.users.slice()

            users.splice(users.findIndex(user => user.id === id), 1)

            this.setState({ users })

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

    handleEdit = user => {
        this.setState({ edit: <ErrorBoundary key="edit"><Edit {...this.props} cancel={this.changeEdit} change={this.changeUser} loading={this.props.loading} user={user} warning={this.props.warning} /></ErrorBoundary> })
    }

    async componentDidMount() {
        try {
            this.props.loading(true)

            const users = await (await api.get("/user")).data

            this.setState({ users })

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
                <div className="table-wrapper">
                    <table className="lx-table is-striped">
                        <thead>
                            <tr>
                                <th><FaUser />&nbsp;&nbsp;Nome</th>
                                <th><FaAddressCard />&nbsp;&nbsp;Matrícula</th>
                                <th><FaTags />&nbsp;&nbsp;Função</th>
                                <th><FaEdit />&nbsp;&nbsp;Editar</th>
                                <th><FaTrash />&nbsp;&nbsp;Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.users.length > 0 ? this.state.users.map(user => {
                                return (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.registry}</td>
                                        <td colSpan={user.id > 1 ? 1 : 2}>{user.title}</td>
                                        {user.id > 1 && <td><button className="lx-btn edit" onClick={() => this.handleEdit(user)}><FaEdit /></button></td>}
                                        {user.id > 1 && <td><button className="lx-btn delete" onClick={() => this.handleDelete(user.id)}><FaTrash /></button></td>}
                                    </tr>
                                )
                            }) : <tr><td colSpan={4}>Não há dados a serem exibidos</td></tr>}
                        </tbody>
                    </table>
                </div>

                {this.state.edit && this.state.edit}
            </>
        )
    }
}

export default List