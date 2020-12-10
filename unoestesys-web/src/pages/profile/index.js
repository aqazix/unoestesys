import React from "react"
import { FaArrowLeft, FaBroom, FaKey, FaReply, FaSave, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { Fieldset, Form, LoaderWrapper, Loader, Main, Title, Text } from "../../components"
import Input from "../../components/fieldset-input"
import Warning from "../../components/warning"
import api from "../../services/api"
import { parseJWT } from "../../helpers"
import { getToken } from "../../services/auth"

const AvatarCard = styled.div`
    background-color: white;
    height: 100%;
    padding: 2rem;
`

const AvatarField = styled.div`
    height: 15rem;
    width: 15rem;
    margin-bottom: 1rem;
    border-radius: 50%;
    overflow: hidden;

    input {
        display: none;
    }

    label {
        cursor: pointer;
    }

    img,
    svg {
        height: 100%;
        width: 100%;
        object-fit: cover;
        object-position: top center;
    }
`

const LocalForm = styled(Form)`
    margin-top: 3rem;
    gap: 3rem;

    ${Fieldset} {
        margin: 2rem 0;

        &:first-child,
        &:last-child {
            margin: 0;
        }
    }

    button {
        line-height: 1.5;
    }

    .actions {
        gap: 1rem;
    }
`

const AvatarPicker = ({ avatar, handleImageChange }) => {
    return (
        <AvatarField>
            <label htmlFor="avatar">
                <img src={avatar ? avatar.includes("data:") ? avatar : `http://localhost:3333/${avatar}` : "https://bit.ly/3jRbrbp"} alt="Escolha sua foto" title="Escolha sua foto" />
            </label>
            <input type="file" id="avatar" name="avatar" onChange={handleImageChange} />
        </AvatarField>
    )
}

class Profile extends React.Component {
    state = {
        avatar: "",
        name: "",
        password: "",
        repeatPassword: "",
        user: null,
        loading: false,
        warning: ""
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleClean = () => {
        document.querySelector("form").reset()

        this.setState({
            avatar: "",
            name: "",
            password: "",
            repeatPassword: ""
        })
    }

    handleImageChange = () => {
        let fr = new FileReader()

        try {
            fr.onload = base64 => {
                this.setState({ avatar: base64.target.result })
            }
            fr.readAsDataURL(document.querySelector("input[type='file']").files[0])
        } catch (error) {
            console.log(error)
        }
    }

    handleSubmit = async e => {
        e.preventDefault()

        this.setState({ loding: true })

        const { id } = parseJWT(getToken())
        let { avatar, name, password, repeatPassword } = this.state

        avatar = avatar.includes(";base64,") ? avatar : ""

        if (password === repeatPassword) {
            try {
                await api.put("/user", { id, avatar, name, password })

                this.setState({ loding: false })
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
        } else if (!password || !repeatPassword) {
            this.setState({ warning: "As senhas devem coincidir." })

            document.querySelector("#password").focus()

            this.setState({ loding: false })
        }
    }

    async componentDidMount() {
        try {
            this.setState({ loding: true })

            const token = parseJWT(getToken())

            if (token) {
                const { id } = token
                const { avatar, name } = await (await api.get("/user/" + id)).data

                this.setState({ avatar, name, loding: false })
            } else {
                this.props.authenticate(false)

                this.props.history.push("/home")

                this.setState({ loding: false })
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
                            <Link to="/home"><button id="return" className="lx-btn"><FaReply />&nbsp;&nbsp;Voltar</button></Link>
                        </div>

                        <div className="lx-row">
                            <Title>Edite o seu perfil</Title>
                        </div>

                        <div className="lx-row align-stretch">
                            <LocalForm alignEnd className="lx-row" onSubmit={this.handleSubmit}>
                                <AvatarCard className="lx-card bs-lg">
                                    <Title center>Foto de perfil</Title>

                                    <AvatarPicker avatar={this.state.avatar} handleImageChange={this.handleImageChange} />

                                    <Text center>Tamanho máximo de 5 MB</Text>
                                </AvatarCard>

                                <div className={`lx-column${window.innerWidth > 900 ? " is-4" : ""}`}>
                                    <Input placeholder="Lorem Ipsum" id="name" label="Nome" icon={<FaUser />} value={this.state.name} onChange={this.handleChange} />

                                    <Input type="password" placeholder="********" id="password" label="Senha" icon={<FaKey />} value={this.state.password} onChange={this.handleChange} />

                                    <Input type="password" placeholder="********" id="repeatPassword" label="Confirme sua enha" icon={<FaKey />} value={this.state.repeatPassword} onChange={this.handleChange} />

                                    <div className="actions">
                                        <button className="lx-btn save"><FaSave />&nbsp;&nbsp;Salvar</button>

                                        <button type="button" className="lx-btn cancel" onClick={this.handleClean}><FaBroom />&nbsp;&nbsp;Limpar</button>

                                        <Link to="/" className="lx-btn clear"><FaArrowLeft />&nbsp;&nbsp;Voltar</Link>
                                    </div>
                                </div>
                            </LocalForm>
                        </div>
                    </div>
                </section>

                {this.state.loading && <LoaderWrapper><Loader /></LoaderWrapper>}

                <Warning warning={this.state.warning} />
            </Main>
        )
    }
}

export default Profile