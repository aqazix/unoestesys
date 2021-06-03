import React from "react"
import { FaCalendar, FaEdit, FaHashtag } from "react-icons/fa"
import Edit from "./edit"
import ErrorBoundary from "../../../components/error-boundary"
import api from "../../../services/api"

class List extends React.Component {
    state = {
        edit: null,
        modules: []
    }

    handleModule = module => {
        let modules = this.state.modules.slice()
        modules[modules.findIndex(item => item.number === module.number)] = module

        this.setState({ modules })
    }

    setEdit = edit => {
        this.setState({ edit })
    }

    handleEdit = module => {
        this.setState({ edit: <ErrorBoundary key="edit"><Edit {...this.props} cancel={this.setEdit} changeModule={this.handleModule} loading={this.props.loading} module={module} warning={this.props.warning} /></ErrorBoundary> })
    }

    async componentDidMount() {
        try {
            this.props.loading(true)

            const modules = await (await api.get("/module")).data

            this.setState({ modules })

            this.props.loading(false)
        } catch (error) {
            const status = error.response ? error.response.status : 401

            if (status !== 401) {
                this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")

                this.props.loading(false)
            } else {
                console.log(error)
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
                                <th><FaHashtag />&nbsp;&nbsp;Número</th>
                                <th><FaCalendar />&nbsp;&nbsp;Data de Início</th>
                                <th><FaCalendar />&nbsp;&nbsp;Data de Fim</th>
                                <th><FaEdit />&nbsp;&nbsp;Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.modules.length > 0 ? this.state.modules.map(module => {
                                console.log(module)
                                return (
                                    <tr key={module.number}>
                                        <td>{module.number}</td>
                                        <td>{module.dateBegin.split("-").reverse().join("/")}</td>
                                        <td>{module.dateEnd.split("-").reverse().join("/")}</td>
                                        <td><button className="lx-btn edit" onClick={() => this.handleEdit(module)}><FaEdit /></button></td>
                                    </tr>
                                )
                            }) :
                                <tr>
                                    <td colspan={4}>Não há dados a serem exibidos</td>
                                </tr>}
                        </tbody>
                    </table>
                </div>

                {this.state.edit && this.state.edit}
            </>
        )
    }
}

export default List