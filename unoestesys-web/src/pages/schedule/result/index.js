import React from "react"
import { FaAlignJustify, FaBook, FaClock, FaFileSignature, FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { brand, form_border, form_icon_bg, form_text, success, white, Card, Text, Title } from "../../../components"
import api from "../../../services/api"
import Input from "../../../components/fieldset-input"
import { parseJWT } from "../../../helpers"
import { getToken } from "../../../services/auth"

const Button = styled(Link)`
    color: white;
    background-color: ${success};
    padding: 0.5em;
    margin: 0 0.5em;
    border-radius: 50%;
`

const CardWrapper = styled(Card)`
    margin: 2rem 0;
    overflow-x: auto;

    .table-wrapper {
        overflow: auto;

        ${window.innerWidth <= 1024 && `
            table {
                font-size: 1rem;
                min-width: 100%;
                width: max-content;
            }
        `}
    }
`

const GridRow = styled.div`
    ${window.innerWidth > 900 ? `
        grid-template-columns: 1fr 1.5fr;
        grid-template-areas: "order input";
    ` : `
        grid-template-columns: 1fr;
        grid-template-areas: "order" "input";
    `}

    .orders {
        grid-area: order;
        height: 100%;

        button {
            color: ${form_text};
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: center;
            transition: all 0.3s;
            background-color: ${form_icon_bg};
            height: 100%;
            width: 20%;
            padding: 0.375rem 0.75rem;
            border: 0.0625rem solid ${form_border};
            border-radius: 0;
            cursor: pointer;

            &:focus,
            &:focus-within,
            &:hover,
            &.is-selected {
                border-color: ${brand};
                color: ${white};
                background-color: ${brand};
            }
        }
    }
`

const Result = styled.div`
    ${window.innerWidth > 900 ? "padding-left: 3rem" : "margin-top: 2rem"};
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1;
`

class Results extends React.Component {
    state = {
        selected: this.props.select,
        data: null,
        role_id: 0,
        modules: []
    }

    async componentDidMount() {
        this.props.loading(true)

        try {
            const modules = await (await api.get("/module")).data
            const { id, role_id } = parseJWT(getToken())

            this.setState({ data: null, id, modules, role_id })

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

    async componentDidUpdate(prevProps) {
        if (prevProps.select !== this.props.select) {
            this.props.loading(true)

            try {
                const data = await (await api.get("/subject?course_id=" + this.props.select + (this.state.role_id === "Professxr" ? "&user_id=" + this.state.id : ""))).data

                this.setState({ data })

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
                {this.state.data ?
                    <Result>
                        <div className="lx-row is-vstart">
                            <div className="lx-column is-12">
                                <Title>{this.state.data.name}</Title>

                                <div className="lx-column is-12">
                                    <form onSubmit={e => e.preventDefault()}>
                                        <GridRow className="lx-grid">
                                            <Input placeholder="Pesquise por uma disciplina específica." id="subject-search" icon={<FaSearch />} />

                                            <div className="orders">
                                                <button><FaAlignJustify /></button>
                                                <button>M1</button>
                                                <button>M2</button>
                                                <button>M3</button>
                                                <button>M4</button>
                                            </div>
                                        </GridRow>
                                    </form>
                                </div>

                                <div className="lx-column is-12">
                                    <CardWrapper className="lx-card">
                                        <div className="table-wrapper">
                                            <table className="lx-table">
                                                <thead>
                                                    <tr>
                                                        <th><FaBook />&nbsp;&nbsp;Disciplina</th>
                                                        <th><FaClock />&nbsp;&nbsp;Duração</th>
                                                        <th><FaFileSignature />&nbsp;&nbsp;Agendar</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.data.map(subject => {
                                                        return (
                                                            <tr key={subject.name}>
                                                                <td>{subject.name}</td>
                                                                <td>{subject.duration}</td>
                                                                <td>
                                                                    {subject.duration === "80" ?
                                                                        <div>
                                                                            <Button to={{
                                                                                pathname: "/calendar",
                                                                                state: {
                                                                                    module: this.state.modules[0].id,
                                                                                    subject: subject.id
                                                                                }
                                                                            }}>M1</Button>
                                                                            <Button to={{
                                                                                pathname: "/calendar",
                                                                                state: {
                                                                                    module: this.state.modules[1].id,
                                                                                    subject: subject.id
                                                                                }
                                                                            }}>M2</Button>
                                                                            <Button to={{
                                                                                pathname: "/calendar",
                                                                                state: {
                                                                                    module: this.state.modules[2].id,
                                                                                    subject: subject.id
                                                                                }
                                                                            }}>M3</Button>
                                                                            <Button to={{
                                                                                pathname: "/calendar",
                                                                                state: {
                                                                                    module: this.state.modules[3].id,
                                                                                    subject: subject.id
                                                                                }
                                                                            }}>M4</Button>
                                                                        </div> :
                                                                        <div>
                                                                            <Button to={{
                                                                                pathname: "/calendar",
                                                                                state: {
                                                                                    module: this.state.modules[4].id,
                                                                                    subject: subject.id
                                                                                }
                                                                            }}>M1</Button>
                                                                            <Button to={{
                                                                                pathname: "/calendar",
                                                                                state: {
                                                                                    module: this.state.modules[5].id,
                                                                                    subject: subject.id
                                                                                }
                                                                            }}>M2</Button>
                                                                        </div>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardWrapper>
                                </div>
                            </div>
                        </div>
                    </Result> :
                    <Result>
                        <div className="lx-row is-vstart">
                            <div className="lx-column is-12">
                                <Title>
                                    Selecione um curso.
                            </Title>

                                <Text>
                                    Selecione um curso para prosseguir com o agendamento.
                            </Text>
                            </div>
                        </div>
                    </Result>
                }
            </>
        )
    }
}

export default Results