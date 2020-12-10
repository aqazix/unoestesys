import React from "react"
import styled from "styled-components"
import { Text } from ".."

const ErrorBox = styled.div`
    background-color: rgba(255,255,255,0.5);
    backdrop-filter: blur(3px);
    padding: 2rem 3rem;
`

class ErrorBoundary extends React.Component {
    state = {
        hasError: false,
        error: { message: "", stack: "" },
        info: { componentStack: "" }
    }

    static getDerivedStateFromError = error => {
        return { hasError: true }
    }

    componentDidCatch(error, info) {
        this.setState({ error, info })
    }

    render() {
        const { hasError } = this.state

        return hasError ? <ErrorBox>
            <Text center>
                <p>
                    Não foi possível carregar o componente.
                </p>

                <p>
                    Contate a equipe de desenvolvimento no e-mail ccpm@unoeste.br com o assunto "Bug encontrado no UnoesteSYS" ou clique no botão "Reporte um bug" no cabeçalho da página.
                </p>
            </Text>
        </ErrorBox> : this.props.children
    }
}

export default ErrorBoundary