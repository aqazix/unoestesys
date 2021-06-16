import React from "react"
import { FaClock, FaEdit, FaFileSignature, FaPuzzlePiece, FaSave, FaTrash, FaUser, FaTimesCircle } from "react-icons/fa"
import { Form, ModalCard, ModalContainer, ModalContent, ModalHeader, Subtitle, Text, Title } from ".."
import Select from "../fieldset-select"
import api from "../../services/api"

class Modal extends React.Component {
    state = {
        appointments: [],
        conflicts: [],
        date: new Date(this.props.date),
        dateString: new Date(this.props.date).toLocaleDateString("pt-BR").split("/").reverse().join("-"),
        professors: [],
        time: 0,
        timesSaturday: [],
        timesWeek: [],
        user_id: 0
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleChangeAppointmentTime = (e, index) => {
        let appointments = this.state.appointments.slice()
        appointments[index].prev = appointments[index][e.target.name]
        appointments[index][e.target.name] = parseInt(e.target.value)

        this.setState({ appointments })
    }

    handleChangeConflictTime = (e, index) => {
        let conflicts = this.state.conflicts.slice()
        conflicts[index].prev = conflicts[index][e.target.name]
        conflicts[index][e.target.name] = parseInt(e.target.value)

        this.setState({ conflicts })
    }

    handleDelete = async appointment => {
        try {
            this.props.loading(true)

            const { day, time_id } = appointment
            const user_id = appointment.professor_id

            await api.put("/appointment/delete", { day, time_id, user_id })

            let appointments = this.state.appointments.slice()

            appointments.splice(appointments.findIndex(item => item.time_id === appointment.time_id), 1)

            this.setState({ appointments })

            this.props.loading(false)

            this.props.close(null)
        } catch (error) {
            const status = error.response ? error.response.status : 401

            if (status !== 401) {
                this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")

                this.props.loading(false)

                setTimeout(() => {
                    this.props.warning("")
                }, 3100)
            } else {
                this.props.history.push("/home")
            }
        }
    }

    handleDeleteConflict = async conflict => {
        try {
            this.props.loading(true)

            const { day, module, subject_id, time_id, professor_id } = conflict
            const module_id = module
            const user_id = professor_id

            await api.put("/conflict/delete", { day, module_id, subject_id, time_id, user_id })

            let conflicts = this.state.conflicts.slice()

            conflicts.splice(conflicts.findIndex(item => item.user_id === conflict.user_id), 1)

            this.setState({ conflicts })

            this.props.loading(false)

            this.props.close(null)
        } catch (error) {
            const status = error.response ? error.response.status : 401

            if (status !== 401) {
                this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")

                this.props.loading(false)

                setTimeout(() => {
                    this.props.warning("")
                }, 3100)
            } else {
                this.props.history.push("/home")
            }
        }
    }

    handleEdit = async appointment => {
        try {
            this.props.loading(true)

            const { day, prev, subject_id, time_id } = appointment

            const module_id = appointment.module
            const user_id = appointment.professor_id

            await api.put("/appointment", { day, prev, module_id, subject_id, time_id, user_id })

            this.props.loading(false)

            this.props.close(null)
        } catch (error) {
            const status = error.response ? error.response.status : 401

            if (status !== 401) {
                this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")

                this.props.loading(false)

                setTimeout(() => {
                    this.props.warning("")
                }, 3100)
            } else {
                this.props.history.push("/home")
            }
        }
    }

    handleEditConflict = async conflict => {
        try {
            this.props.loading(true)

            let { day, subject_id, time_id } = conflict

            const module_id = conflict.module
            const user_id = conflict.professor_id

            await api.post("/appointment", { day, module_id, subject_id, time_id, user_id })

            time_id = conflict.prev

            await api.put("/conflict/delete", { day, module_id, subject_id, time_id, user_id })

            this.props.loading(false)

            this.props.close(null)
        } catch (error) {
            const status = error.response ? error.response.status : 401

            if (status !== 401) {
                this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")

                this.props.loading(false)

                setTimeout(() => {
                    this.props.warning("")
                }, 3100)
            } else {
                this.props.history.push("/home")
            }
        }
    }

    handleSubmit = async e => {
        e.preventDefault()

        try {
            this.props.loading(true)

            let day = this.props.date
            let module_id = this.props.module
            let subject_id = this.props.subject
            let time_id = this.state.time
            let user_id = this.state.user_id > 0 && this.state.user_id !== 1 ? this.state.user_id : this.props.id

            module_id = parseInt(module_id)
            subject_id = parseInt(subject_id)
            time_id = parseInt(time_id)
            user_id = parseInt(user_id)

            await api.post("/appointment", { day, module_id, subject_id, time_id, user_id })

            const appointments = await (await api.get("/appointment?module_id=" + module_id + "&day=" + this.state.dateString)).data

            this.setState({ appointments })

            this.props.loading(false)

            this.props.close(null)
        } catch (error) {
            const status = error.response ? error.response.status : 401

            if (status !== 401) {
                this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")

                this.props.loading(false)

                setTimeout(() => {
                    this.props.warning("")
                }, 3100)
            } else {
                this.props.history.push("/home")
            }
        }
    }

    async componentDidMount() {
        try {
            this.props.loading(true)

            const appointments = await (await api.get("/appointment?day=" + this.state.dateString + "&module_id=" + this.props.module + "&subject_id=" + this.props.subject)).data
            const response_times_saturday = await (await api.get("/time?saturday=1")).data
            const response_times_week = await (await api.get("/time?saturday=0")).data
            const conflicts = await (await api.get("/conflict?day=" + this.state.dateString + "&module_id=" + this.props.module + "&subject_id=" + this.props.subject)).data

            if (this.props.role_id < 3) {
                let professors = await (await api.get("/user?role_id=3")).data

                professors = professors.map(professor => {
                    return {
                        value: professor.id,
                        label: professor.name
                    }
                })

                this.setState({ professors })
            }

            let timesSaturday = response_times_saturday.map(times => {
                return {
                    value: times.id,
                    label: times.hour
                }
            })

            let timesWeek = response_times_week.map(times => {
                return {
                    value: times.id,
                    label: times.hour
                }
            })

            this.setState({ appointments, conflicts, timesSaturday, timesWeek })

            this.props.loading(false)
        } catch (error) {
            const status = error.response ? error.response.status : 401

            if (status !== 401) {
                this.props.warning(error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.")

                this.props.loading(false)

                setTimeout(() => {
                    this.props.warning("")
                }, 3100)
            } else {
                this.props.history.push("/home")
            }
        }
    }

    render() {
        return (
            <ModalContainer>
                <ModalCard className="lx-card">
                    <ModalHeader>
                        <Title>Agendar Webconferência no dia - {this.state.date.toLocaleDateString("pt-BR")}</Title>

                        <button className="lx-btn" onClick={() => this.props.close()}><FaTimesCircle /></button>
                    </ModalHeader>

                    <ModalContent className="lx-card">
                        {this.state.date > new Date(Date.now()) &&
                            <>
                                <div className="row">
                                    <Title>Escolha o horário desejado abaixo.</Title>
                                    {this.state.appointments.length > 0 &&
                                        <Text>
                                            <p>
                                                Ainda mais abaixo, há uma tabela mostrando se existem outras Webconferências nesta mesma data.
                                            </p>
                                        </Text>
                                    }
                                </div>

                                <div className="row">
                                    <Form alignEnd onSubmit={this.handleSubmit}>
                                        {this.state.timesSaturday && this.state.timesWeek &&
                                            <Select id="time" label="Escolha o horário" icon={<FaClock />} options={this.state.date.getDay() + 1 === 6 ? this.state.timesSaturday : this.state.timesWeek} value={this.state.time} onChange={this.handleChange} required />
                                        }

                                        {this.props.role_id < 3 && this.state.professors && <Select id="user_id" label="Professor" icon={<FaUser />} options={this.state.professors} value={this.state.user_id} onChange={this.handleChange} required />}

                                        <div className="lx-row">
                                            <div className="actions">
                                                <button className="lx-btn" id="save" type="submit"><FaSave />&nbsp;&nbsp;Agendar</button>

                                                <button className="lx-btn" id="cancel" type="button" onClick={this.props.close}><FaTrash />&nbsp;&nbsp;Cancelar</button>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </>
                        }

                        {this.state.appointments && this.state.appointments.length > 0 &&
                            <div className="row">
                                <Subtitle>Webconferências neste dia:</Subtitle>
                                <div className="table-row">
                                    <table className="lx-table is-striped">
                                        <thead>
                                            <tr>
                                                <th><FaFileSignature />&nbsp;&nbsp;Professor</th>
                                                <th><FaPuzzlePiece />&nbsp;&nbsp;Módulo</th>
                                                <th><FaClock />&nbsp;&nbsp;Horário</th>
                                                <th><FaTrash />&nbsp;&nbsp;Excluir</th>
                                                <th><FaEdit />&nbsp;&nbsp;Alterar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.appointments && this.state.appointments.map((appointment, index) => {
                                                return (
                                                    <tr key={appointment.time_id}>
                                                        <td>{appointment.professor}</td>
                                                        <td>{appointment.module}</td>
                                                        {(appointment.professor_id === this.props.id || this.props.role_id < 3) && this.state.date > new Date(Date.now()) ?
                                                            <td>
                                                                {this.state.timesSaturday && this.state.timesWeek &&
                                                                    <Select id="time_id" icon={<FaClock />} options={new Date(appointment.day).getDay() + 1 === 6 ? this.state.timesSaturday : this.state.timesWeek} value={appointment.time_id} onChange={e => this.handleChangeAppointmentTime(e, index)} required />
                                                                }
                                                            </td> :
                                                            <td colSpan={3}>{new Date(appointment.day).getDay() + 1 === 6 ? this.state.timesSaturday[this.state.timesSaturday.findIndex(time => time.value === appointment.time_id)].label : this.state.timesWeek[this.state.timesWeek.findIndex(time => time.value === appointment.time_id)].label}</td>
                                                        }

                                                        {(appointment.professor_id === this.props.id || this.props.role_id < 3) && this.state.date > new Date(Date.now()) &&
                                                            <>
                                                                <td>
                                                                    <button className="lx-btn delete" onClick={() => this.handleDelete(appointment)}><FaTrash /></button>
                                                                </td>

                                                                <td>
                                                                    <button className="lx-btn edit" onClick={() => this.handleEdit(appointment)}><FaEdit /></button>
                                                                </td>
                                                            </>
                                                        }
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }

                        {this.state.conflicts && this.state.conflicts.length > 0 &&
                            <div className="row">
                                <Subtitle>Conflitos de agendamento:</Subtitle>
                                <div className="table-row">
                                    <table className="lx-table is-striped">
                                        <thead>
                                            <tr>
                                                <th>{<FaFileSignature />}&nbsp;&nbsp;Professor</th>
                                                <th>{<FaPuzzlePiece />}&nbsp;&nbsp;Módulo</th>
                                                <th>{<FaClock />}&nbsp;&nbsp;Horário</th>
                                                <th>{<FaTrash />}&nbsp;&nbsp;Excluir</th>
                                                <th>{<FaEdit />}&nbsp;&nbsp;Alterar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.conflicts && this.state.conflicts.map((conflict, index) => {
                                                return (
                                                    <tr key={conflict.time_id}>
                                                        <td>{conflict.professor}</td>
                                                        <td>{conflict.module}</td>
                                                        {(conflict.professor_id === this.props.id || this.props.role_id < 3) && this.state.date > new Date(Date.now()) ?
                                                            <td>
                                                                {this.state.timesSaturday && this.state.timesWeek &&
                                                                    <Select id="time_id" icon={<FaClock />} options={new Date(conflict.day).getDay() + 1 === 6 ? this.state.timesSaturday : this.state.timesWeek} value={conflict.time_id} onChange={e => this.handleChangeConflictTime(e, index)} required />
                                                                }
                                                            </td> :
                                                            <td colSpan={3}>{new Date(conflict.day).getDay() + 1 === 6 ? this.state.timesSaturday[this.state.timesSaturday.findIndex(time => time.value === conflict.time_id)].label : this.state.timesWeek[this.state.timesWeek.findIndex(time => time.value === conflict.time_id)].label}</td>
                                                        }

                                                        {(conflict.professor_id === this.props.id || this.props.role_id < 3) && this.state.date > new Date(Date.now()) &&
                                                            <>
                                                                <td>
                                                                    <button className="lx-btn delete" onClick={() => this.handleDeleteConflict(conflict)}>{<FaTrash />}</button>
                                                                </td>

                                                                <td>
                                                                    <button className="lx-btn edit" onClick={() => this.handleEditConflict(conflict)}>{<FaEdit />}</button>
                                                                </td>
                                                            </>
                                                        }
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                    </ModalContent>
                </ModalCard>
            </ModalContainer>
        )
    }
}

export default Modal