import React from "react"
import { FaBan, FaBook, FaBroom, FaChalkboardTeacher, FaHourglassHalf, FaGraduationCap, FaMinus, FaPlus, FaSave } from "react-icons/fa"
import { Link } from "react-router-dom"
import api from "../../../services/api"
import { AddButton, DeleteButton, Form, SelectWrapper } from "../../../components"
import Input from "../../../components/fieldset-input"
import Select from "../../../components/fieldset-select"

class Create extends React.Component {
    state = {
        name: "",
        duration: "",
        course_id: "",
        professors: [],
        options: [],
        courses: []
    }

    addProfessor = () => {
        let professors = this.state.professors.slice()

        if (professors.length < 2) {
            professors.push(0)
            this.setState({ professors })
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleClean = () => {
        document.querySelector("form").reset()

        this.setState({ name: "", duration: "", professors: [this.state.options[0].value] })
    }

    handleSubmit = async e => {
        e.preventDefault()

        this.props.loading(true)

        const { name, duration, professors, course_id } = this.state

        if (name && duration && professors && course_id) {
            try {
                await api.post("/subject", { name, duration, professors, course_id })

                this.handleClean()

                this.props.loading(false)

                document.getElementById("name").focus()
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

    removeProfessor = e => {
        const dataset = parseInt(e.target.dataset ? e.target.dataset.professor : e.target.parentElement.dataset.professor)
        let professors = this.state.professors.slice()
        const index = professors.findIndex(professor => professor === dataset)

        if (professors.length > 1) {
            professors.splice(index, 1)
            this.setState({ professors })
        }
    }

    setProfessor = (index, value) => {
        let professors = this.state.professors.slice()

        professors[index] = parseInt(value)

        this.setState({ professors })
    }

    async componentDidMount() {
        this.props.loading(true)

        try {
            let response = await (await api.get("/user?role_id=3")).data

            let options = response.map(professor => {
                return {
                    value: professor.id,
                    label: professor.name
                }
            })

            if (options.length > 0)
                this.setState({ professors: [options[0].value], options })

            response = await (await api.get("/course")).data

            let courses = response.map(course => {
                return {
                    value: course.id,
                    label: course.name
                }
            })

            if (courses.length > 0)
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
            <Form alignEnd onSubmit={this.handleSubmit}>
                <div className="lx-row align-start">
                    <Input id="name" label="Nome da disciplina" icon={<FaBook />} placeholder="Ex: Gestão de Pessoas" value={this.state.name} onChange={this.handleChange} required />

                    <Select id="duration" label="Duração (em horas)" icon={<FaHourglassHalf />} options={[{ value: 40, label: "40" }, { value: 80, label: "80" }]} value={this.state.duration} onChange={this.handleChange} required />

                    {this.state.courses && <Select id="course_id" label="Curso" icon={<FaChalkboardTeacher />} options={this.state.courses} value={this.state.course_id} onChange={this.handleChange} required />}

                    {this.state.professors.length > 0 &&
                        this.state.professors.map((professor, index) => {
                            return (
                                <SelectWrapper key={index}>
                                    <Select id="professor" label="Professor" icon={<FaGraduationCap />} value={professor} onChange={e => this.setProfessor(index, e.target.value)} options={this.state.options} required />

                                    {this.state.professors.length === 1 ?
                                        <AddButton type="button" className="lx-btn" onClick={this.addProfessor}><FaPlus /></AddButton> :
                                        <DeleteButton type="button" className="lx-btn" data-professor={professor} onClick={this.removeProfessor}><FaMinus /></DeleteButton>
                                    }
                                </SelectWrapper>
                            )
                        })
                    }
                </div>

                <div className="lx-row">
                    <div className="actions">
                        <button type="submit" id="save" className="lx-btn"><FaSave />&nbsp;&nbsp;Criar</button>

                        <button type="button" id="clear" className="lx-btn" onClick={this.handleClean}><FaBroom />&nbsp;&nbsp;Limpar</button>

                        <Link to="/home" id="cancel" className="lx-btn"><FaBan />&nbsp;&nbsp;Cancelar</Link>
                    </div>
                </div>
            </Form>
        )
    }
}

export default Create