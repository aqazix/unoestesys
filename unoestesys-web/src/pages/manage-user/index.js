import React from "react"
import { FaList, FaPlusCircle, FaReply } from "react-icons/fa"
import { Link } from "react-router-dom"
import Create from "./create"
import List from "./list"
import { Loader, LoaderWrapper, Main, Title, Tabs, TabsLinks, TabsContent } from "../../components"
import ErrorBoundary from "../../components/error-boundary"
import Warning from "../../components/warning"
import { parseJWT } from "../../helpers/index"
import api from "../../services/api"
import { getToken } from "../../services/auth"

class ManageUser extends React.Component {
    state = {
        component: null
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

            const { id } = parseJWT(getToken())
            const user = await (await api.get("/user/" + id)).data

            if (user.title && user.title === "Administradxr") {
                this.setState({ component: <ErrorBoundary key="list"><List {...this.props} loading={this.setLoading} warning={this.setWarning} /></ErrorBoundary>, loading: false })
            } else {
                this.props.history.push("/home")
            }
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

    render() {
        return (
            <Main>
                <section>
                    <div className="lx-container-70">
                        <div className="lx-row is-start">
                            <Link to="/home" id="return" className="lx-btn"><FaReply />&nbsp;&nbsp;Voltar</Link>
                        </div>

                        <div className="lx-row">
                            <Title>Gerenciar Usuários</Title>

                            <Tabs className="lx-card">
                                <TabsLinks className="tabs">
                                    <button className="lx-btn tablink is-active" data-target="list" onClick={() => {
                                        document.querySelectorAll(".tabs button").forEach(button => button.classList.remove("is-active"))
                                        document.querySelector(".tabs button[data-target='list']").classList.add("is-active")
                                        this.setState({ component: <ErrorBoundary key="list"><List {...this.props} loading={this.setLoading} warning={this.setWarning} /></ErrorBoundary> })
                                    }}><FaList />&nbsp;&nbsp;Listar</button>
                                    <button className="lx-btn tablink" data-target="create" onClick={() => {
                                        document.querySelectorAll(".tabs button").forEach(button => button.classList.remove("is-active"))
                                        document.querySelector(".tabs button[data-target='create']").classList.add("is-active")
                                        this.setState({ component: <ErrorBoundary key="create"><Create {...this.props} loading={this.setLoading} warning={this.setWarning} /></ErrorBoundary> })
                                    }}><FaPlusCircle />&nbsp;&nbsp;Criar</button>
                                </TabsLinks>

                                <TabsContent>
                                    {this.state.component}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </section>

                {this.state.loading && <LoaderWrapper><Loader /></LoaderWrapper>}

                <Warning warning={this.state.warning} />
            </Main>
        )
    }
}

export default ManageUser