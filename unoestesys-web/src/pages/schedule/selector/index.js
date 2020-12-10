import React from "react"
import { FaSearch } from "react-icons/fa"
import styled from "styled-components"
import { brand, white, Card, Fieldset } from "../../../components"
import Input from "../../../components/fieldset-input"
import api from "../../../services/api"
import { parseJWT } from "../../../helpers"
import { getToken } from "../../../services/auth"

const Collection = styled.ul`
    height: 13.395rem;
    padding: 0;
    margin: 0;

    .page-collection {
        height: 0;
        width: 100%;
        position: relative;
        left: 100%;
        transition: left 0.3s ease-in-out;

        &.is-active {
            height: 100%;
            left: 0;
        }
    }

    .lx-collection-item {
        height: 20%;
        padding: 1em 1.25em;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .lx-btn {
            font-weight: 700;
            text-align: left;
            background-color: transparent;
            width: 100%;
            padding: 0;
            margin: 0;
            box-shadow: none;
            cursor: pointer;
        }

        &:focus,
        &:focus-within,
        &:hover,
        &.is-selected {
            background-color: ${brand};

            .lx-btn {
                color: ${white};
            }
        }
    }
`

const Pagination = styled.div`
    width: 100%;
    padding: 1.25em;
    display: flex;
    align-items: center;
    justify-content: center;

    .lx-pagination-item {
        color: ${brand};
        font-size: 1rem;
        font-weight: 700;
        background-color: ${white};
        height: fit-content;
        width: fit-content;
        padding: 0.6rem 1rem;
        border: 0.0625rem solid ${brand};
        cursor: pointer;

        &:hover,
        &.is-selected {
            color: ${white};
            background-color: ${brand};
        }
    }

    .pagination-wrapper {
        overflow-x: hidden;

        .pagination-translate {
            display: flex;
        }
    }
`

const SideNav = styled.nav`
    width: 25rem;

    form {
        margin: 1rem 0 2rem;
    }
`

let maxWidth = 0
let width = 0
let translate = 0

class Selector extends React.Component {
    state = {
        courses: null,
        pages: 0,
        role_id: 0
    }

    handlePrev = () => {
        let current = document.querySelector(".page-collection.is-active")
        if (current.previousElementSibling !== null) {
            current.classList.remove("is-active")
            current.previousElementSibling.classList.add("is-active")

            current = document.querySelector(".lx-pagination-item.is-selected")
            current.classList.remove("is-selected")
            current.previousElementSibling.classList.add("is-selected")

            translate += width
            if (Math.abs(translate) < maxWidth)
                document.querySelector(".pagination-translate").style.transform = "translateX(" + translate + "px)"
        }
    }

    handleNext = () => {
        let current = document.querySelector(".page-collection.is-active")
        if (current.nextElementSibling !== null) {
            current.classList.remove("is-active")
            current.nextElementSibling.classList.add("is-active")

            current = document.querySelector(".lx-pagination-item.is-selected")
            current.classList.remove("is-selected")
            current.nextElementSibling.classList.add("is-selected")

            translate -= width
            if (Math.abs(translate) < maxWidth)
                document.querySelector(".pagination-translate").style.transform = "translateX(" + translate + "px)"
        }
    }

    handleSelect = e => {
        document.querySelectorAll(".lx-collection-item").forEach(item => item.classList.remove("is-selected"))
        e.target.classList.add("is-selected")
        this.props.select(e.target.dataset.course ? e.target.dataset.course : e.target.parentElement.dataset.course)
    }

    async componentDidMount() {
        this.props.loading(true)

        try {
            const { id, role_id } = parseJWT(getToken())
            const response = await (await api.get("/course" + (role_id === 3 ? "?user_id=" + id : ""))).data

            let courses = []
            let array = []

            response.forEach((course, index) => {
                array.push(course)
                if ((index + 1) % 5 === 0 && index !== 0) {
                    courses.push(array)
                    array = []
                }
            })

            courses.push(array)

            this.setState({ courses, id, pages: courses.length, role_id })

            width = document.querySelector(".pagination-wrapper .lx-pagination-item").offsetWidth
            maxWidth = width * document.querySelector(".pagination-translate").childElementCount - document.querySelector(".pagination-translate").offsetWidth

            document.querySelector(".pagination-wrapper").style.maxWidth = width * 5 + "px"

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

    render() {
        return (
            <SideNav>
                <Card className="lx-card">
                    <form>
                        <Fieldset>
                            <Input placeholder="Pesquise por um curso específico." id="search" icon={<FaSearch />} />
                        </Fieldset>
                    </form>

                    <Collection className="lx-collection">
                        {this.state.courses &&
                            this.state.courses.map((courseArray, index) => {
                                return (
                                    <div key={index} className={`page-collection${!index ? " is-active" : ""}`}>
                                        {courseArray.map(course => {
                                            return (
                                                <li key={course.name} className="lx-collection-item" data-course={course.id} onClick={this.handleSelect}>
                                                    <button className="lx-btn">{course.name}</button>
                                                </li>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                    </Collection>

                    <Pagination>
                        <button className="lx-pagination-item is-disabled" onClick={this.handlePrev}>&lt;</button>
                        <div className="pagination-wrapper">
                            <div className="pagination-translate">
                                {this.state.courses && this.state.courses.map((elem, index) => {
                                    return (
                                        <button key={index} className={`lx-pagination-item${!index ? " is-selected" : ""}`}>{index + 1}</button>
                                    )
                                })}
                            </div>
                        </div>
                        <button className={`lx-pagination-item${this.state.courses && this.state.courses.length <= 1 ? " is-disabled" : ""}`} onClick={this.handleNext}>&gt;</button>
                    </Pagination>
                </Card>
            </SideNav>
        )
    }
}

export default Selector