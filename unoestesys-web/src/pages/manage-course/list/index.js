import React from "react"
import { FaChalkboardTeacher, FaEdit, FaSearch, FaTrash, FaUser } from "react-icons/fa"
import { SearchRow, OrderButton } from "../../../components"
import Input from "../../../components/fieldset-input"
import api from "../../../services/api"
import Edit from "./edit"
import ErrorBoundary from "../../../components/error-boundary"

class List extends React.Component {
    state = {
        courses: [],
        edit: null,
        order: "name-CRE",
        search: ""
    }

    handleCancel = () => {
        this.setState({ edit: null })
    }

    handleChange = course => {
        let courses = this.state.courses.slice()

        courses[courses.findIndex(item => item.id === course.id)] = course

        this.setState({ courses })
    }

    handleSearch = e => {
        this.setState({ [e.target.name]: e.target.value }, async () => {
            try {
                const { search } = this.state

                const courses = await (await api.get("/course?name=" + search)).data

                this.setState({ courses })
            } catch (error) {
                const status = error.response ? error.response.status : 401

                if (status !== 401) {
                    this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")
                } else {
                    this.props.history.push("/home")
                }
            }
        })
    }

    handleEdit = course => {
        this.setState({ edit: <ErrorBoundary key="edit"><Edit {...this.props} cancel={this.handleCancel} change={this.handleChange} course={course} loading={this.props.loading} warning={this.props.warning} /></ErrorBoundary> })
    }

    handleDelete = async course => {
        try {
            this.props.loading(true)

            await api.delete("/course/" + course)

            let courses = this.state.courses.slice()

            courses.splice(courses.findIndex(item => item.id === course), 1)

            this.setState({ courses })

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

    handleOrder = (a, b) => {
        const [reference, order] = this.state.order.split("-")

        switch (reference) {
            case "coordinator": {
                if (order === "CRE") {
                    if (a.coordinator > b.coordinator) return 1
                    if (a.coordinator < b.coordinator) return -1
                } else {
                    if (a.coordinator > b.coordinator) return -1
                    if (a.coordinator < b.coordinator) return 1
                }

                return 0
            }

            default: {
                if (order === "CRE") {
                    if (a.name > b.name) return 1
                    if (a.name < b.name) return -1
                } else {
                    if (a.name > b.name) return -1
                    if (a.name < b.name) return 1
                }

                return 0
            }
        }
    }

    orderByCoordinator = () => {
        let courses = this.state.courses.slice()
        let [reference, order] = this.state.order.split("-")

        reference = "coordinator"
        order = order === "CRE" ? "DEC" : "CRE"

        this.setState({ order: reference + "-" + order }, () => {
            courses.sort(this.handleOrder)

            this.setState({ courses })
        })
    }

    orderByName = () => {
        let courses = this.state.courses.slice()
        let [reference, order] = this.state.order.split("-")

        if (reference === "name")
            order = order === "CRE" ? "DEC" : "CRE"
        else
            reference = "name"

        this.setState({ order: reference + "-" + order }, () => {
            courses.sort(this.handleOrder)

            this.setState({ courses })
        })
    }

    async componentDidMount() {
        try {
            this.props.loading(true)

            const courses = await (await api.get("/course")).data

            this.setState({ courses })

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
                <SearchRow>
                    <Input id="search" icon={<FaSearch />} placeholder="Procure por um curso." value={this.state.search} onChange={this.handleSearch} />
                </SearchRow>

                <div className="table-wrapper">
                    <table className="lx-table is-striped">
                        <thead>
                            <tr>
                                <th><OrderButton onClick={this.orderByName}><FaChalkboardTeacher />&nbsp;&nbsp;Nome</OrderButton></th>
                                <th><OrderButton onClick={this.orderByCoordinator}><FaUser />&nbsp;&nbsp;Coordenador</OrderButton></th>
                                <th><FaEdit />&nbsp;&nbsp;Editar</th>
                                <th><FaTrash />&nbsp;&nbsp;Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.courses.length > 0 ? this.state.courses.map(course => {
                                return (
                                    <tr key={course.name}>
                                        <td>{course.name}</td>
                                        <td>{course.coordinator}</td>
                                        <td><button className="lx-btn edit" onClick={() => this.handleEdit(course)}><FaEdit /></button></td>
                                        <td><button className="lx-btn delete" onClick={() => this.handleDelete(course.id)}><FaTrash /></button></td>
                                    </tr>
                                )
                            }) :
                                <tr>
                                    <td colspan={4}>Não há dados a serem exibidos</td>
                                </tr>}
                        </tbody>
                    </table>
                </div>

                {this.state.edit}
            </>
        )
    }
}

export default List