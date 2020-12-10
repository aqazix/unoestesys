import React from "react"
import { FaBan, FaBook, FaEdit, FaHourglassHalf, FaGraduationCap, FaMinus, FaPlus, FaSave } from "react-icons/fa"
import { AddButton, DeleteButton, Form, SelectWrapper, Subtitle } from "../../../../components"
import Input from "../../../../components/fieldset-input"
import Select from "../../../../components/fieldset-select"
import api from "../../../../services/api"

class Edit extends React.Component {
    state = {
        name: this.props.subject.name,
        duration: this.props.subject.duration,
        professors: [],
        options: []
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

    handleSubmit = async e => {
        e.preventDefault()

        this.props.loading(true)

        const { name, duration, professors } = this.state

        if (name & duration & professors) {
            try {
                let { subject } = this.props
                subject.name = name
                subject.duration = duration
                subject.professors = professors

                const { id } = subject
                await api.put("/subject", { id, name, duration, professors })

                this.props.change({ ...subject })

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

            let professors = this.props.subject.professors.map(professor => {
                return professor.id
            })

            if (options.length > 0)
                this.setState({ professors, options })

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
        if (prevProps.subject.name !== this.props.subject.name) {
            this.props.loading(true)

            try {
                let professors = this.props.subject.professors.map(professor => {
                    return professor.id
                })

                this.setState({
                    name: this.props.subject.name,
                    duration: this.props.subject.duration,
                    professors
                })

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
    }

    render() {
        return (
            <>
                <Subtitle><FaEdit />&nbsp;&nbsp;Editar disciplina</Subtitle>
                <Form alignEnd onSubmit={this.handleSubmit}>
                    <div className="lx-row is-start">
                        <Input id="name" label="Nome da disciplina" icon={<FaBook />} value={this.state.name} onChange={this.handleChange} required />

                        <Select id="duration" label="Duração (em horas)" icon={<FaHourglassHalf />} options={[{ value: 40, label: "40" }, { value: 80, label: "80" }]} value={this.state.duration} onChange={this.handleChange} required />

                        {this.state.professors.length > 0 &&
                            this.state.professors.map((professor, index) => {
                                return (
                                    <SelectWrapper key={index}>
                                        <Select id="professor" label="Professores" icon={<FaGraduationCap />} value={professor} onChange={e => this.setProfessor(index, e.target.value)} options={this.state.options} required />

                                        {this.props.subject.professors.length === 1 ?
                                            <AddButton type="button" className="lx-btn" onClick={this.addProfessor}><i className={<FaPlus />}></i></AddButton> :
                                            <DeleteButton type="button" className="lx-btn" data-professor={professor} onClick={this.removeProfessor}><i className={<FaMinus />} data-professor={professor}></i></DeleteButton>
                                        }
                                    </SelectWrapper>
                                )
                            })
                        }
                    </div>
                    <div className="lx-row">
                        <div className="actions">
                            <button type="submit" id="save" className="lx-btn"><i className={<FaSave />}></i>&nbsp;&nbsp;Atualizar</button>

                            <button type="button" id="cancel" className="lx-btn" onClick={() => this.props.cancel(null)}><i className={<FaBan />}></i>&nbsp;&nbsp;Cancelar</button>
                        </div>
                    </div>
                </Form>
            </>
        )
    }
}

export default Edit