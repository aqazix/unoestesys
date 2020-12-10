import React from "react"
import { FaArrowLeft, FaArrowRight, FaClock, FaReply } from "react-icons/fa"
import { Link } from "react-router-dom"
import { CalendarBody, CalendarHeader, CalendarWrapper, Main, LoaderWrapper, Loader } from "../../components"
import ErrorBoundary from "../../components/error-boundary"
import Modal from "../../components/modal"
import Warning from "../../components/warning"
import getMonth, { parseJWT } from "../../helpers"
import api from "../../services/api"
import { getToken } from "../../services/auth"

const _months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

class Calendar extends React.Component {
    state = {
        appointments: [],
        subject: 0,
        date: 0,
        year: 0,
        month: 0,
        months: [],
        conflicts: [],
        yearBegin: "",
        monthBegin: "",
        dayBegin: "",
        monthEnd: "",
        dayEnd: "",
        modal: false,
        role_id: 0,
        loading: false,
        warning: ""
    }

    closeModal = () => {
        this.setState({ modal: false })
    }

    handlePrev = () => {
        let { month, monthBegin, year } = this.state

        month = parseInt(month)
        monthBegin = parseInt(monthBegin)

        if (month > monthBegin) {
            month--
            this.setState({ month, months: getMonth(month - 1), year })
        }
    }

    handleNext = () => {
        let { month, monthEnd, year } = this.state

        month = parseInt(month)
        monthEnd = parseInt(monthEnd)

        if (month < monthEnd) {
            month++
            this.setState({ month, months: getMonth(month - 1), year })
        }
    }

    setModal = day => {
        const date = this.state.year + "-" + this.state.month.toLocaleString(undefined, { minimumIntegerDigits: 2 }) + "-" + day.toLocaleString(undefined, { minimumIntegerDigits: 2 })
        this.setState({ date, modal: true })
    }

    setLoading = loading => {
        this.setState({ loading })
    }

    setWarning = warning => {
        this.setState({ warning })
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true })

            const { state } = this.props.location
            const { id, role_id } = parseJWT(getToken())

            if (state) {
                const response = await api.get("/module/" + state.module)
                let appointments = await (await api.get("/appointment?module_id=" + state.module + "&subject_id=" + state.subject)).data
                let conflicts = await (await api.get("/conflict?module_id=" + state.module)).data
                let [yearBegin, monthBegin, dayBegin] = response.data.dateBegin.split("-")
                let [, monthEnd, dayEnd] = response.data.dateEnd.split("-")

                appointments = appointments.map(day => day.day.split("T")[0])
                conflicts = conflicts.map(conflict => conflict.day.split("T")[0].split("-")[2])

                this.setState({
                    appointments,
                    id,
                    subject: state.subject,
                    year: yearBegin,
                    conflicts,
                    month: parseInt(monthBegin),
                    months: getMonth(parseInt(monthBegin - 1), yearBegin),
                    dayBegin,
                    dayEnd,
                    monthBegin,
                    monthEnd,
                    role_id,
                    loading: false
                })
            } else {
                this.props.history.push("/home")
            }
        } catch (error) {
            this.setState({ warning: error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.", loading: false})

            setTimeout(() => {
                this.setState({ warning: "" })
            }, 3100)
        }
    }

    async componentDidUpdate(_, prevState) {
        if (prevState.modal !== this.state.modal && this.state.modal === false) {
            try {
                this.setState({ loading: true })

                const { state } = this.props.location

                let appointments = await (await api.get("/appointment?module_id=" + state.module + "&subject_id=" + state.subject)).data
                let conflicts = await (await api.get("/conflict?module_id=" + state.module)).data

                appointments = appointments.map(day => day.day.split("T")[0])
                conflicts = conflicts.map(conflict => conflict.day.split("T")[0].split("-")[2])

                this.setState({ appointments, conflicts, loading: false })
            } catch (error) {
                const status = error.response ? error.response.status : 401

                if (status !== 401) {
                    this.setState({ warning: error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.", loading: false})

                    setTimeout(() => {
                        this.setState({ warning: "" })
                    }, 3100)
                } else {
                    this.props.history.push("/home")
                }
            }
        }
    }

    render() {
        return (
            <Main>
                <div className="lx-container-70">
                    <div className="lx-row is-start">
                        <Link to="/schedule" id="return" className="lx-btn"><FaReply />&nbsp;&nbsp;Voltar</Link>
                    </div>
                </div>

                <section>
                    <div className="lx-container-70">
                        <div className="lx-row">
                            <div className="lx-column">
                                <CalendarWrapper className="lx-card">
                                    <CalendarHeader calendar className="is-text-centered">
                                        <button className="lx-btn" onClick={this.handlePrev}><FaArrowLeft /></button>

                                        <span className="year">{this.state.year}</span>

                                        <span className="month">{_months[this.state.month - 1]}</span>

                                        <button className="lx-btn" onClick={this.handleNext}><FaArrowRight /></button>
                                    </CalendarHeader>

                                    <CalendarBody calendar>
                                        <span className="day name">Dom</span>

                                        <span className="day name">Seg</span>

                                        <span className="day name">Ter</span>

                                        <span className="day name">Qua</span>

                                        <span className="day name">Qui</span>

                                        <span className="day name">Sex</span>

                                        <span className="day name">Sab</span>

                                        <ErrorBoundary key="calendar">
                                            {this.state.months && this.state.months.map(week => {
                                                const { dayBegin, dayEnd, monthBegin, monthEnd } = this.state

                                                return (
                                                    week.map((day, index) => {
                                                        const current = day ? this.state.year.toString().padStart(4, "0") + "-" + this.state.month.toString().padStart(2, "0") + "-" + day.day.toString().padStart(2, "0") : ""
                                                        const currentDay = day ? day.day.toString().padStart(2, "0") : ""
                                                        const comparison = day ? day.day >= dayBegin && day.day <= dayEnd : false
                                                        const compareDay = new Date(current) > new Date(Date.now())

                                                        return (
                                                            day ?
                                                                this.state.appointments.filter(elem => elem === current).length > 0 ?
                                                                    monthBegin === monthEnd ?
                                                                        <span key={index} className={`day ${this.state.conflicts.includes(currentDay) ? "conflicts" : "scheduled"}${day.weekday === 0 ? " disabled" : ""}${comparison && day.weekday !== 0 && compareDay ? " module" : ""}`} onClick={day.weekday > 0 && comparison ? () => this.setModal(day.day) : null}>
                                                                            {day.day}
                                                                            {this.state.appointments.filter(elem => elem === current).length > 0 ?
                                                                                <span><FaClock /></span> : ""}
                                                                        </span>
                                                                        : <span key={index} className={`day ${this.state.conflicts.includes(currentDay) ? "conflicts" : "scheduled"}${day.weekday === 0 ? " disabled" : compareDay ? " module" : ""}`} onClick={day.weekday > 0 && comparison ? () => this.setModal(day.day) : null}>
                                                                            {day.day}
                                                                            {this.state.appointments.filter(elem => elem === current).length > 0 ?
                                                                                <span><FaClock /></span> :
                                                                                ""}
                                                                        </span>
                                                                    : monthBegin === monthEnd ?
                                                                        <span key={index} className={`day${day.weekday === 0 ? " disabled" : ""}${comparison && day.weekday !== 0 && compareDay ? " module" : ""}`} onClick={day.weekday > 0 && comparison ? () => this.setModal(day.day) : null}>
                                                                            {day.day}
                                                                        </span>
                                                                        : <span key={index} className={`day${day.weekday === 0 ? " disabled" : compareDay ? " module" : ""}`} onClick={day.weekday > 0 && comparison ? () => this.setModal(day.day) : null}>
                                                                            {day.day}
                                                                        </span>
                                                                : <span key={index} className="day disabled"></span>
                                                        )
                                                    })
                                                )
                                            })}
                                        </ErrorBoundary>
                                    </CalendarBody>
                                </CalendarWrapper>
                            </div>
                        </div>
                    </div>
                </section>

                <ErrorBoundary key="modal">
                    {this.state.modal &&
                        <Modal
                            {...this.props}
                            close={this.closeModal}
                            date={this.state.date}
                            id={this.state.id}
                            loading={this.setLoading}
                            module={this.props.location.state.module}
                            subject={this.state.subject}
                            role_id={this.state.role_id}
                            warning={this.setWarning} />
                    }
                </ErrorBoundary>

                {this.state.loading && <LoaderWrapper><Loader /></LoaderWrapper>}

                <Warning warning={this.state.warning} />
            </Main>
        )
    }
}

export default Calendar