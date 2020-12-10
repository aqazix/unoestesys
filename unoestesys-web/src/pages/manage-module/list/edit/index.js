import React from "react"
import { FaBan, FaCalendar, FaEdit, FaSave } from "react-icons/fa"
import { Subtitle, Form } from "../../../../components"
import Input from "../../../../components/fieldset-input"
import api from "../../../../services/api"

class Edit extends React.Component {
    state = {
        module: {
            number: 0,
            dateBegin: "",
            dateEnd: ""
        }
    }

    handleChange = e => {
        this.setState({
            module: {
                ...this.state.module,
                [e.target.name]: e.target.value
            }
        })
    }

    handleSubmit = async e => {
        try {
            e.preventDefault()

            this.props.loading(true)

            const { dateBegin, dateEnd } = this.state.module

            if (new Date(dateBegin) < new Date(dateEnd)) {
                await api.put("/module", { ...this.state.module })

                this.handleClean()

                this.props.changeModule(this.state.module)

                this.props.cancel(null)

                this.props.loading(false)
            } else {
                this.props.warning("A data de início não pode ser depois da data de fim.")

                document.querySelector("#dateBegin").focus()

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

    componentDidMount() {
        this.setState({ module: this.props.module })
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ module: this.props.module })
        }
    }

    render() {
        return (
            <>
                <Subtitle><FaEdit />&nbsp;&nbsp;Editar módulo</Subtitle>
                <Form alignEnd onSubmit={this.handleSubmit}>
                    <div className="lx-row is-start">
                        <Input type="date" id="dateBegin" label="Data de Início" icon={<FaCalendar />} value={this.state.module.dateBegin} onChange={this.handleChange} required />

                        <Input type="date" id="dateEnd" label="Data de Fim" icon={<FaCalendar />} value={this.state.module.dateEnd} onChange={this.handleChange} required />
                    </div>
                    <div className="lx-row">
                        <div className="actions">
                            <button type="submit" id="save" className="lx-btn"><FaSave />&nbsp;&nbsp;Atualizar</button>

                            <button type="button" id="cancel" className="lx-btn" onClick={() => this.props.cancel(null)}><FaBan />&nbsp;&nbsp;Cancelar</button>
                        </div>
                    </div>
                </Form>
            </>
        )
    }
}

export default Edit