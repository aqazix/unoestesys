import React from "react"
import { FaCalendarCheck, FaEnvelope, FaExclamationCircle, FaExclamationTriangle, FaExternalLinkAlt, FaThumbsUp, FaTimes } from "react-icons/fa"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { danger, foreground, success, warning, white, CalendarWrapper, CalendarBody, CalendarHeader, LoaderWrapper, Loader, Card, Main, Subtitle, Text, Title } from "../../components"
import Warning from "../../components/warning"
import getMonth, { parseJWT } from "../../helpers"
import api from "../../services/api"
import { getToken, signOut } from "../../services/auth"

import astronautIcon from "../../assets/media/images/astronaut.svg"
// import chatIcon from "../../assets/media/images/chat.svg"
// import contractIcon from "../../assets/media/images/contract.svg"
import course from "../../assets/media/images/course.svg"
// import docsIcon from "../../assets/media/images/docs.svg"
import module from "../../assets/media/images/module.svg"
import refreshIcon from "../../assets/media/images/refresh.svg"
import subjectsIcon from "../../assets/media/images/subjects.svg"
import usersIcon from "../../assets/media/images/users.svg"

const FunctionCard = styled(Card)`
    height: 100%;
    padding: 3rem 1.5rem;
    display: grid;
    grid-template-areas:
        "info illustration"
        "action action";
    grid-template-rows: 1fr min-content;
    grid-template-columns: auto ${window.innerWidth > 1440 ? "10rem" : "6rem"};
    gap: 1rem;

    .info {
        grid-area: info;

        .title {
            font-weight: 700;
        }
    }

    .illustration {
        height: ${window.innerWidth > 1440 ? "8rem" : "6rem"};
        border-radius: 50%;
        grid-area: illustration;
        overflow: hidden;

        img,
        svg {
            height: 100%;
            width: 100%;
            object-fit: contain;
        }
    }

    .action {
        display: grid;
        grid-area: action;
        place-items: center;

        .lx-btn {
            color: ${white};
            font-size: 1rem;
            font-weight: 700;
            line-height: normal;
            background-color: ${success};
            width: fit-content;
        }
    }
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(${window.innerWidth > 1024 ? "3" : window.innerWidth > 768 ? "2" : "1"}, minmax(15rem, 1fr));
    gap: 1rem;
`

const Hero = styled.section`
    .lx-column {
        padding-top: 0;
        padding-bottom: 0;
    }

    .lx-row {
        justify-content: space-between;
        ${window.innerWidth > 900 ? "padding: 0.75rem;" : `
            padding: 0;
            flex-flow: wrap column;

            .lx-card {
                width: 100%
            }
        `}
    }
`

const NotificationCenter = styled(Card)`
    width: 70%;
    display: grid;
    grid-gap: 1.2rem;
    ${window.innerWidth > 900 ? `
            max-height: 55vh;
            grid-template-rows: auto 1fr;
            grid-template-columns: 1fr 1fr;
            grid-template-areas:
                "header header"
                "notices calendar";
        ` : `
            max-height: 70vh;
            grid-template-rows: auto 1fr max-content;
            grid-template-columns: 1fr;
            grid-template-areas:
                "header"
                "notices"
                "calendar";
        `
    }

    ${Title} {
        margin: 0;
        grid-area: header;
    }

    .notices {
        padding-right: 0.25rem;
        grid-area: notices;
        display: grid;
        grid-auto-rows: min-content;
        gap: 0.5rem;
        overflow-y: auto;

        .empty {
            background-color: ${foreground};
            padding: 0 1em;
        }

        .notice {
            width: 100%;
            padding: 0.35rem 0.7rem;
            border-radius: 0.328em;
            display: flex;
            align-items: center;
            justify-content: space-between;
            user-select: none;

            ${Text} {
                color: ${white};

                p {
                    margin: 0;
                }
            }

            .actions {
                height: 100%;
                width: fit-content;
                display: grid;
                grid-auto-flow: column;
                gap: 1rem;
                place-items: center;

                button,
                .check {
                    color: ${white};
                    font-size: 1rem;
                    padding: 0.15rem;
                    border: none;
                    border-radius: 0.25rem;
                }
            }

            &.success {
                background-color: ${success};
            }

            &.warning {
                background-color: ${warning};
            }

            &.danger {
                background-color: ${danger};
            }
        }
    }
`

const User = styled(Card)`
    min-height: 30rem;
    height: auto;
    width: 28%;
    ${window.innerWidth <= 900 && "margin-bottom: 1rem;"}
    display: grid;
    grid-auto-flow: row;
    gap: 1rem;
    place-items: center;
    place-content: center;

    .user-pic {
        width: 15rem;
        height: 15rem;
        overflow: hidden;
        border-radius: 50%;

        img,
        svg {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
        }
    }

    .user-info {
        width: 100%;

        ${Subtitle} {
            text-align: center;
        }

        p {
            display: flex;
            align-items: center;
        }
    }
`

const _currentDate = new Date(Date.now())
const _month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

class Home extends React.Component {
    state = {
        appointments: [],
        avatar: "",
        conflicts: [],
        email: "",
        id: "",
        month: [],
        name: "",
        notifications: [],
        registry: "",
        role_id: 0,
        title: "",
        loading: false,
        warning: ""
    }

    dismissNotification = async (id, index) => {
        try {
            this.setState({ loading: true })

            await api.delete("/notification/" + id)

            const notifications = this.state.notifications.slice()

            notifications.splice(index, 1)

            this.setState({ notifications, loading: false })
        } catch (error) {
            this.setState({ warning: error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.", loading: false })

            setTimeout(() => {
                this.setState({ warning: "" })
            }, 3100)
        }
    }

    async componentDidMount() {
        try {
            this.setState({ month: getMonth(_currentDate.getMonth()) })

            this.setState({ loading: true })

            const token = parseJWT(getToken())

            if (token) {
                const { id, role_id, exp } = token

                if (Date.now() < exp * 1000) {
                    this.setState({ id, role_id })

                    const response = await (await api.get("/user/" + id)).data

                    const { avatar, email, name, registry, title } = response

                    const notifications = await (await api.get("/notification?user_id=" + id)).data

                    this.setState({ avatar, email, name, notifications, registry, title, loading: false })
                } else {
                    signOut()

                    this.props.authenticate(false)

                    this.props.history.push("/")

                    this.setState({ loading: false })
                }
            } else {
                this.props.authenticate(false)

                this.props.history.push("/")

                this.setState({ loading: false })
            }

        } catch (error) {
            this.setState({ warning: error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.", loading: false })

            setTimeout(() => {
                this.setState({ warning: "" })
            }, 3100)
        }
    }

    render() {
        return (
            <Main>
                <Hero>
                    <div className="lx-container-70">
                        <div className="lx-row align-stretch">
                            <User className="lx-card">
                                <div className="user-pic bs-sm">
                                    <img src={this.state.avatar ? "http://localhost:3333/" + this.state.avatar : "https://bit.ly/3jRbrbp"} alt="" loading="lazy" />
                                </div>

                                <div className="user-info">
                                    <Subtitle>
                                        Bem-vindx, Srx. {this.state.name.split(" ")[0]}
                                    </Subtitle>

                                    <Text>
                                        <p>
                                            <FaEnvelope />&nbsp;
                                            <b>{this.state.email}</b>
                                        </p>

                                        {this.state.role_id === 3 &&
                                            <p>
                                                <FaCalendarCheck />&nbsp;
                                                Gerencie suas aulas muito mais facilmente.
                                            </p>
                                        }
                                    </Text>
                                </div>
                            </User>

                            <NotificationCenter className="lx-card notification-center">
                                <Title>
                                    Notificações
                                </Title>

                                <div className="notices">
                                    {this.state.notifications && this.state.notifications.length > 0 ?
                                        this.state.notifications.map((notification, index) => {
                                            console.log(notification);
                                            return (
                                                notification.type === 1 ?
                                                    <div key={notification.day + index} className="notice success bs-md">
                                                        <Text>
                                                            <p><FaThumbsUp />&nbsp;&nbsp;Conflito de agendamento do dia {new Date(notification.day).toLocaleDateString("en-GB", { timeZone: "UTC" })}</p> resolvido!
                                                        </Text>

                                                        <div className="actions">
                                                            <button className="dismiss" onClick={() => this.dismissNotification(notification.id, index)}><FaTimes /></button>
                                                        </div>
                                                    </div> : notification.type === 2 ?
                                                        <div key={notification.day + index} className="notice warning bs-md">
                                                            <Text>
                                                                <p><FaExclamationTriangle />&nbsp;&nbsp;Há um conflito no angendamento da webconferência do dia {new Date(notification.day).toLocaleDateString("en-GB", { timeZone: "UTC" })}.</p>
                                                            </Text>

                                                            <div className="actions">
                                                                <Link to={{
                                                                    pathname: "/calendar",
                                                                    state: {
                                                                        module: notification.module_id,
                                                                        subject: notification.subject_id
                                                                    }
                                                                }} className="check"><FaExternalLinkAlt /></Link>
                                                                <button className="dismiss" onClick={() => this.dismissNotification(notification.id, index)}><FaTimes /></button>
                                                            </div>
                                                        </div> :
                                                        <div key={notification.day + index} className="notice danger bs-md">
                                                            <Text>
                                                                <p><FaExclamationCircle />&nbsp;&nbsp;Lorem ipsum dolor sit amet consectetur.</p>
                                                            </Text>

                                                            <div className="actions">
                                                                <button className="check"><FaExternalLinkAlt /></button>
                                                            </div>
                                                        </div>
                                            )
                                        }) :
                                        <div className="empty">
                                            <p>Não há notificações</p>
                                        </div>
                                    }
                                </div>

                                <CalendarWrapper className="bs-sm">
                                    <CalendarHeader>
                                        <span className="day">{_currentDate.getDate()}</span>

                                        <span className="month">{_month[_currentDate.getMonth()]}</span>
                                    </CalendarHeader>

                                    <CalendarBody>
                                        <span className="day name">Dom</span>

                                        <span className="day name">Seg</span>

                                        <span className="day name">Ter</span>

                                        <span className="day name">Qua</span>

                                        <span className="day name">Qui</span>

                                        <span className="day name">Sex</span>

                                        <span className="day name">Sab</span>

                                        {this.state.month && this.state.month.map(week => {
                                            return (
                                                week.map((day, index) => {
                                                    return (
                                                        day ?
                                                            <span key={index} className={`day${day.weekday === 0 ? " disabled" : ""}`}>{day.day}</span> :
                                                            <span key={index} className="day disabled"></span>
                                                    )
                                                })
                                            )
                                        })}
                                    </CalendarBody>
                                </CalendarWrapper>
                            </NotificationCenter>
                        </div>
                    </div>
                </Hero>

                <section>
                    <div className="lx-container-70">
                        <Grid>
                            {/* {(this.state.role_id < 3) &&
                                <FunctionCard disabled className="lx-card card-link">
                                    <div className="info">
                                        <Title>Criar um contrato</Title>

                                        <Text>
                                            <p>
                                                Crie contratos.
                                            </p>
                                        </Text>
                                    </div>

                                    <div className="illustration">
                                        <img src={contractIcon} alt="Contrato" />
                                    </div>

                                    <div className="action">
                                        <Link to="/contracts" className="lx-btn">Criar agora</Link>
                                    </div>
                                </FunctionCard>
                            } */}

                            {(this.state.role_id < 3) &&
                                <FunctionCard className="lx-card">
                                    <div className="info">
                                        <Title>Gerenciar Disciplinas</Title>
                                    </div>

                                    <div className="illustration">
                                        <img src={subjectsIcon} alt="Disciplinas" />
                                    </div>

                                    <div className="action">
                                        <Link to="/manage-subject" className="lx-btn">Gerenciar</Link>
                                    </div>
                                </FunctionCard>
                            }

                            {(this.state.role_id < 3) &&
                                <FunctionCard className="lx-card">
                                    <div className="info">
                                        <Title>Gerenciar Cursos</Title>
                                    </div>

                                    <div className="illustration">
                                        <img src={course} alt="Gerenciar Cursos" />
                                    </div>

                                    <div className="action">
                                        <Link to="/manage-course" className="lx-btn">Gerenciar</Link>
                                    </div>
                                </FunctionCard>
                            }

                            {/* {(this.state.role_id < 3) &&
                                <FunctionCard className="lx-card">
                                    <div className="info">
                                        <Title>Gerenciar Formulários</Title>

                                        <Text>
                                            <p>
                                                Crie um formulário para sua pesquisa ou live.
                                            </p>
                                        </Text>
                                    </div>

                                    <div className="illustration">
                                        <img src={docsIcon} alt="Formulários" />
                                    </div>

                                    <div className="action">
                                        <Link to="/manage-form-create" className="lx-btn">Criar agora</Link>
                                    </div>
                                </FunctionCard>
                            } */}

                            {this.state.role_id === 1 &&
                                <FunctionCard className="lx-card">
                                    <div className="info">
                                        <Title>Gerenciar Usuários</Title>

                                        <Text>
                                            <p>
                                                Gerencie os usuários. Atribua cargos e responsabilidades.
                                            </p>
                                        </Text>
                                    </div>

                                    <div className="illustration">
                                        <img src={usersIcon} alt="Usuários" />
                                    </div>

                                    <div className="action">
                                        <Link to="/manage-user" className="lx-btn">Gerenciar</Link>
                                    </div>
                                </FunctionCard>
                            }

                            <FunctionCard className="lx-card">
                                <div className="info">
                                    <Title>Gerencie Perfil</Title>

                                    <Text>
                                        <p>
                                            Gerencie as configurações ideais.
                                        </p>
                                    </Text>
                                </div>

                                <div className="illustration">
                                    <img src={astronautIcon} alt="Perfil" />
                                </div>

                                <div className="action">
                                    <Link to="/profile" className="lx-btn">Gerenciar</Link>
                                </div>
                            </FunctionCard>

                            {(this.state.role_id < 3) &&
                                <FunctionCard className="lx-card">
                                    <div className="info">
                                        <Title>Gerenciar Módulos</Title>

                                        <Text>
                                            <p>
                                                Gerencie as datas de início e fim dos módulos.
                                            </p>
                                        </Text>
                                    </div>

                                    <div className="illustration">
                                        <img src={module} alt="Gerenciar Módulos" />
                                    </div>

                                    <div className="action">
                                        <Link to="/manage-module" className="lx-btn">Gerenciar</Link>
                                    </div>
                                </FunctionCard>
                            }

                            {/* <FunctionCard className="lx-card">
                                <div className="info">
                                    <Title>
                                        Chat
                                    </Title>

                                    <Text>
                                        <p>
                                            Converse com outros colaboradores.
                                        </p>
                                    </Text>
                                </div>

                                <div className="illustration">
                                    <img src={chatIcon} alt="Chat" />
                                </div>

                                <div className="action">
                                    <Link to="/webchat" className="lx-btn">Entrar</Link>
                                </div>
                            </FunctionCard> */}

                            <FunctionCard className="lx-card">
                                <div className="info">
                                    <Title>
                                        Webconferências
                                    </Title>

                                    <Text>
                                        <p>
                                            Agende uma data e hora para uma web conferência.
                                        </p>
                                    </Text>
                                </div>

                                <div className="illustration">
                                    <img src={refreshIcon} alt="Webconferência" />
                                </div>

                                <div className="action">
                                    <Link to="/schedule" className="lx-btn">Agendar agora</Link>
                                </div>
                            </FunctionCard>
                        </Grid>
                    </div>
                </section>

                {this.state.loading && <LoaderWrapper><Loader /></LoaderWrapper>}

                <Warning warning={this.state.warning} />
            </Main>
        )
    }
}

export default Home