import React from "react"
import { FaChalkboardTeacher, FaEdit, FaFileSignature, FaHourglassHalf, FaGraduationCap, FaLayerGroup, FaSearch, FaTrash } from "react-icons/fa"
import Edit from "./edit"
import { OrderButton, SearchRow } from "../../../components"
import ErrorBoundary from "../../../components/error-boundary"
import Input from "../../../components/fieldset-input"
import api from "../../../services/api"

class List extends React.Component {
    state = {
        edit: null,
        error: false,
        order: "course-CRE",
        subjects: [],
        search: ""
    }

    changeEdit = edit => {
        this.setState({ edit })
    }

    changeSubject = subject => {
        let subjects = this.state.subjects.slice()
        subjects[subjects.findIndex(elem => elem.id === subject.id)] = subject

        this.setState({ subjects })
    }

    handleDelete = async subject_id => {
        try {
            this.props.loading(true)

            await api.delete("/subject/" + subject_id)

            let subjects = this.state.subjects.slice()

            subjects.splice(subjects.findIndex(subject => subject.id === subject_id), 1)

            this.setState({ subjects })

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

    handleEdit = subject => {
        this.setState({ edit: <ErrorBoundary key="edit"><Edit {...this.props} cancel={this.changeEdit} change={this.changeSubject} loading={this.props.loading} subject={subject} warning={this.props.warning} /></ErrorBoundary> })
    }

    handleOrder = (a, b) => {
        const [reference, order] = this.state.order.split("-")

        switch (reference) {
            case "name": {
                if (order === "CRE") {
                    if (a.name > b.name) return 1
                    if (a.name < b.name) return -1
                } else {
                    if (a.name > b.name) return -1
                    if (a.name < b.name) return 1
                }

                return 0
            }

            case "duration": {
                if (order === "CRE") {
                    if (a.duration > b.duration) return 1
                    if (a.duration < b.duration) return -1
                } else {
                    if (a.duration > b.duration) return -1
                    if (a.duration < b.duration) return 1
                }

                return 0
            }

            default: {
                if (order === "CRE") {
                    if (a.course > b.course) return 1
                    if (a.course < b.course) return -1
                } else {
                    if (a.course > b.course) return -1
                    if (a.course < b.course) return 1
                }

                return 0
            }
        }
    }

    handleSearch = e => {
        this.setState({ [e.target.name]: e.target.value }, async () => {
            try {
                const { search } = this.state
                const subjects = await (await api.get("/subject?name=" + search)).data

                this.setState({ subjects })
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

    orderByCourse = () => {
        let subjects = this.state.subjects.slice()
        let [reference, order] = this.state.order.split("-")

        reference = "course"
        order = order === "CRE" ? "DEC" : "CRE"

        this.setState({ order: reference + "-" + order }, () => {
            subjects.sort(this.handleOrder)

            this.setState({ subjects })
        })
    }

    orderByDuration = () => {
        let subjects = this.state.subjects.slice()
        let [reference, order] = this.state.order.split("-")

        reference = "duration"
        order = order === "CRE" ? "DEC" : "CRE"

        this.setState({ order: reference + "-" + order }, () => {
            subjects.sort(this.handleOrder)

            this.setState({ subjects })
        })
    }

    orderByName = () => {
        let subjects = this.state.subjects.slice()
        let [reference, order] = this.state.order.split("-")

        if (reference === "name")
            order = order === "CRE" ? "DEC" : "CRE"
        else
            reference = "name"

        this.setState({ order: reference + "-" + order }, () => {
            subjects.sort(this.handleOrder)

            this.setState({ subjects })
        })
    }

    async componentDidMount() {
        this.props.loading(true)

        try {
            if (this.props.title !== "Professxr") {
                const subjects = await (await api.get("/subject")).data

                subjects.sort(this.handleOrder)

                this.setState({ subjects })

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

    render() {
        return (
            <>
                <SearchRow>
                    <Input id="search" placeholder="Procure por uma disciplina." icon={<FaSearch />} value={this.state.search} onChange={this.handleSearch} />
                </SearchRow>

                <div className="table-wrapper">
                    <table className="lx-table is-striped">
                        <thead>
                            <tr>
                                <th><OrderButton onClick={this.orderByName}><FaFileSignature />&nbsp;&nbsp;Título</OrderButton></th>
                                <th><OrderButton onClick={this.orderByCourse}><FaChalkboardTeacher />&nbsp;&nbsp;Curso</OrderButton></th>
                                <th><OrderButton onClick={this.orderByDuration}><FaHourglassHalf />&nbsp;&nbsp;Duração (Horas)</OrderButton></th>
                                <th><FaLayerGroup />&nbsp;&nbsp;Módulos</th>
                                <th><FaGraduationCap />&nbsp;&nbsp;Professores</th>
                                <th><FaEdit />&nbsp;&nbsp;Editar</th>
                                <th><FaTrash />&nbsp;&nbsp;Excluir</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.subjects.length > 0 ? this.state.subjects.map(subject => {
                                return (
                                    <tr key={subject.name}>
                                        <td>{subject.name}</td>

                                        <td>{subject.course}</td>

                                        <td>{subject.duration}</td>

                                        <td>{parseInt(subject.duration) / 20}</td>

                                        <td>
                                            <ul>
                                                {subject.professors.map(professor => {
                                                    return (
                                                        <li key={professor.name}>{professor.name}</li>
                                                    )
                                                })}
                                            </ul>
                                        </td>

                                        <td>
                                            <button className="lx-btn edit" onClick={() => this.handleEdit(subject)}><FaEdit /></button>
                                        </td>

                                        <td>
                                            <button className="lx-btn delete" onClick={() => this.handleDelete(subject.id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                )
                            }) :
                                <tr>
                                    <td colspan={7}>Não há dados a serem exibidos</td>
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