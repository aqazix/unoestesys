import React from "react"
import { FaReply } from "react-icons/fa"
import { Link } from "react-router-dom"
import Results from "./result"
import Selector from "./selector"
import { LoaderWrapper, Loader, Main, Title } from "../../components"
import ErrorBoundary from "../../components/error-boundary"
import Warning from "../../components/warning"

class Schedule extends React.Component {
    state = {
        selected: 0,
        loading: false,
        warning: ""
    }

    setLoading = loading => {
        this.setState({ loading })
    }

    setSelected = selected => {
        this.setState({ selected })
    }

    setWarning = warning => {
        this.setState({ warning })
    }

    render() {
        return (
            <Main>
                <div className="lx-container-70">
                    <div className="lx-row justify-start">
                        <Link to="/home" id="return" className="lx-btn"><FaReply />&nbsp;&nbsp;Voltar</Link>
                    </div>
                </div>

                <section>
                    <div className="lx-container-70">
                        <div className="lx-row">
                            <Title>
                                Agendar Webconferências
                            </Title>
                        </div>

                        <div className="lx-row align-stretch">
                            <ErrorBoundary key="selector"><Selector {...this.props} loading={this.setLoading} select={this.setSelected} warning={this.setWarning} /></ErrorBoundary>

                            <ErrorBoundary key="result"><Results {...this.props} loading={this.setLoading} select={this.state.selected} warning={this.setWarning} /></ErrorBoundary>
                        </div>
                    </div>
                </section>

                {this.state.loading && <LoaderWrapper><Loader /></LoaderWrapper>}

                <Warning warning={this.state.warning} />
            </Main>
        )
    }
}

export default Schedule