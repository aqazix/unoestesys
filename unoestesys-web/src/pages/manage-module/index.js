import React from "react"
import { FaListOl, FaReply } from "react-icons/fa"
import { Link } from "react-router-dom"
import List from "./list"
import { Main, Tabs, TabsLinks, Title, TabsContent, LoaderWrapper, Loader } from "../../components"
import ErrorBoundary from "../../components/error-boundary"
import Warning from "../../components/warning"
import { parseJWT } from "../../helpers"
import { getToken } from "../../services/auth"

class ManageModule extends React.Component {
    state = {
        loading: false,
        warning: ""
    }

    setLoading = loading => {
        this.setState({ loading })
    }

    setWarning = warning => {
        this.setState({ warning })
    }

    async componentDidMount() {
        try {
            this.setState({ loading: false })

            const { role_id } = parseJWT(getToken())

            if (role_id === null || role_id > 2) {
                this.props.history.push("/home")
            }
        } catch (error) {
            this.setState({ warning: error.response ? error.response.data.message : "Algo deu errado. Por favor, tente novamente mais tarde.", loading: false})

            setTimeout(() => {
                this.setState({ warning: "" })
            }, 3100)
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
                            <Title>
                                Gerenciar Módulos
                            </Title>

                            <Tabs className="lx-card">
                                <TabsLinks>
                                    <button className="lx-btn tablink is-active"><FaListOl />&nbsp;&nbsp;Listar</button>
                                </TabsLinks>
                                <TabsContent>
                                    <ErrorBoundary key="list"><List {...this.props} loading={this.setLoading} warning={this.setWarning} /></ErrorBoundary>
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

export default ManageModule