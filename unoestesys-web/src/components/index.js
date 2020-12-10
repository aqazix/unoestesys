import styled, { createGlobalStyle, keyframes } from "styled-components"
import bgImage from "../assets/media/images/bg.png"

const bg = "white"
const bg_dark_01 = "#282a36"
const bg_dark_02 = "#1d1f27"
const bg_dark_03 = "#44475a"
export const brand = "#538e46"
export const success = "#538e46"
export const warning = "#ffb86c"
export const danger = "#ff5555"
export const change = "#6272a4"
export const foreground = "#f8f8f2"
export const white = "#ffff"
export const black = "#212121"
export const form_icon_bg = "#e9ecef"
export const form_border = "#ced4da"
export const form_text = "#495057"
export const calendar_text = "#99a1a7"

export const swing_in_top_fwd = keyframes`
    0% {
        transform: rotateX(-100deg);
        transform-origin: top;
        opacity: 0;
    }
    100% {
        transform: rotateX(0deg);
        transform-origin: top;
        opacity: 1;
    }
`

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`

export const AddButton = styled.button`
    color: white;
    background-color: ${success};
    padding: 1.075rem 1rem;
    grid-area: button;
`

export const CalendarBody = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    ${props => !props.calendar ? `
        grid-template-rows: 1fr;
        grid-auto-rows: 1fr;
    ` : `
        grid-template-rows: 3.125rem;
        grid-auto-rows: ${window.innerWidth < 900 ? "3rem" : "4.5rem"};
    `}
    grid-area: body;
    gap: 0.25em;

    .day {
        color: ${calendar_text};
        ${window.innerWidth <= 900 && "padding: 0.8rem 0.4rem;"}
        border-radius: 0.15em;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        user-select: none;

        svg {
            position: relative;
            left 10px;
        }

        &.conflicts {
            color: ${white};
            background-color: ${warning};
            border-color: ${warning};
        }

        &.disabled,
        &.holiday {
            color: ${black};
            background-color: #ccc;
        }

        &.name {
            text-transform: uppercase;
            font-weight: 600;
        }

        &.scheduled {
            color: ${white};
            background-color: ${success};
        }

        ${props => props.calendar && `
            &.module {
                border: 2px solid ${success};
                cursor: pointer;

                &.conflicts {
                    border-color: transparent;
                }

                &.scheduled,
                &:hover {
                    background-color: rgba(83,142,70,0.3);
                }
            }
        `}
    }
`

export const CalendarHeader = styled.div`
    background-color: ${success};
    padding: 1rem;
    position: relative;
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: min-content;
    grid-area: header;

    button {
        color: white;
        font-size: 1.5rem;
        box-shadow: none;
        position: absolute;
        top: 35%;

        &:first-child {
            left: 0;
        }

        &:last-child {
            right: 0;
        }

        &:hover,
        &:focus,
        &:focus-whithin {
            color: ${brand};
            background-color: white;
        }
    }

    span {
        color: ${white};
        user-select: none;

        &.day {
            font-size: 1.4rem;
            font-weight: 900;
        }

        &.month {
            font-size: 1rem;
            ${props => !props.calendar ? "text-transform: lowercase;" : ""}
        }

        &.year {
            font-size: 2rem;
            font-weight: 900;
        }
    }
`

export const CalendarWrapper = styled.div`
    background-color: ${white};
    border-radius: 0.328em;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-areas:
        "header"
        "body";
    grid-area: calendar;
    overflow: hidden;
`

export const Card = styled.div`
    background-color: ${bg};
`

export const DeleteButton = styled.button`
    color: white;
    background-color: ${danger};
    padding: 1.075rem 1rem;
    grid-area: button;
`

export const Fieldset = styled.div`
    width: 100%;
    ${props => props.login ? "margin: 2rem 0" : "margin: 0"};
    position: relative;
    display: flex;
    flex-wrap: wrap;
    grid-area: ${props => props.select ? "select" : "input"};
    align-items: center;
    justify-content: flex-start;

    &:first-child {
        margin-top: 0;
    }

    &:last-child {
        margin-bottom: 0;
    }
`

export const Form = styled.form`
    width: 100%;
    ${props => props.login && `
        min-width: 15rem;
        max-width: 20rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `}

    .actions {
        margin: ${window.innerWidth > 900 ? "3rem 0 1rem 0" : "1.5rem 0 0"};
        width: 100%;
        display: flex;
        align-items: center;
        
        ${props => props.alignEnd ? `
            justify-content: flex-start;
            gap: 1rem;
            ${window.innerWidth < 900 ? "flex-direction: column" : "flex-direction: row-reverse"};
        ` : "justify-content: space-between"};

        .lx-btn {
            color: ${white};
            ${window.innerWidth < 900 ? `
                font-size: 1rem;
                width: 100%;
            ` : ""}
            font-weight: 700;
            line-height: 18.6px;
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            justify-content: center;

            &#cancel,
            &.cancel {
                background-color: ${danger};
            }

            &#clear,
            &.clear {
                color: ${black};
                background-color: ${white};
            }

            &#save,
            &.save {
                background-color: ${success};
            }
        }

        ${props => props.login && `
            margin: 0;
            ${window.innerWidth > 900 ? "flex-direction: row-reverse;" : `
                flex-direction: column-reverse;
                gap: 1rem;
            `}

            button {
                height: 32px;
                cursor: pointer;
            }

            .lx-btn {
                padding: 0.5rem;
            }
        `}
    }
`

export const Tabs = styled.div`
    background-color: white;
    width: 100%;
    overflow: hidden;
`

export const TabsContent = styled.div`
    width: 100%;
    padding: 1rem;
    border: 0.0625rem solid ${form_icon_bg};
    border-top: none;
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;

    .table-wrapper {
        font-size: 1rem;
        max-height: ${window.innerHeight > 800 ? "50vh" : "100%"};
        overflow: auto;

        table {
            ${window.innerWidth <= 1024 && `
                min-width: 100%;
                width: max-content;
            `}
            border-radius: 0.328em;
            overflow: hidden;
    
            tr {
                th,
                td {
                    border-radius: 0;
                }
    
                th {
                    font-weight: 700;
                    text-transform: uppercase;
                }
    
                td {
                    a {
                        span {
                            &:last-child {
                                text-decoration: underline;
                            }
                        }
                    }
    
                    .lx-btn {
                        color: #ffffff;
                        font-weight: 700;
                        max-width: 5rem;
                        padding: 0.5rem;
                        margin: 0;
                        box-shadow: none;
                        display: flex;
                        align-items: center;
                        justify-content: center;
    
                        &.edit {
                            background-color: ${success};
                        }
    
                        &.delete {
                            background-color: ${danger};
                        }
                    }
                }
            }
        }

        &::-webkit-scrollbar-thumb:vertical {
            display: none;
        }
    }

    .edit-form {
        width: 100%;
        margin: 2rem 0 0 0;
    }

    .actions {
        gap: 1rem;
    }
`

export const TabsLinks = styled.div`
    background-color: ${form_icon_bg};
    width: 100%;
    border: 0.0625rem solid ${success};
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;

    .tablink {
        font-weight: 700;
        background-color: ${white};
        padding: 0.875rem 1rem;
        border: none;
        border-radius: 0;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;

        &:focus,
        &:focus-within,
        &:hover,
        &.is-active {
            color: ${white};
            background-color: ${success};
        }
    }
`

export default createGlobalStyle`
    html,
    body {
        font-family: "Roboto", sans-serif;
        ${
            window.innerWidth <= 900 ? "font-size: 77.5%" :
                window.innerWidth <= 1440 ? "font-size: 82.5%" :
                    "font-size: 87.5%"
        };
    }

    textarea {
        &:not([rows]) {
            max-height: 20rem;
        }

        &::-webkit-resizer {
            color: ${success};
            clip-path: polygon(100% 0%, 0% 100%, 100% 100%);
        }
    }

    body {
        background: transparent url(${bgImage}) no-repeat fixed center;
        ${
    window.innerWidth <= 1024 ? "background-size: cover" :
        "background-size: contain"
    };
        min-height: 100vh;
        margin: 0;
        display: grid;
        grid-template-rows: auto 1fr auto;

        &.dark {
            color: ${white};
            background-color: ${bg_dark_01};

            header {
                nav {
                    &#nav-top {
                        background-color: ${bg_dark_02};
        
                        .actions {
                            a,
                            button {
                                &:focus,
                                &:hover {
                                    background-color: ${bg_dark_01};
                                }
                            }
                        }
                    }
        
                    &#nav-offcanvas {
                        background-color: ${bg_dark_03};
        
                        a,
                        button {
                            &:focus,
                            &:hover {
                                background-color: ${bg_dark_02};
                            }
                        }
                    }
                }
            }

            footer {
                background-color: ${bg_dark_02};
            }

            a,
            button {
                color: ${white};
            }

            main {
                .lx-card {
                    background-color: ${bg_dark_02};
                }
            }

            ${CalendarWrapper} {
                background-color: ${bg_dark_03};

                .disabled {
                    background-color: ${bg_dark_01}
                }
            }

            ${TabsLinks} {
                background-color: ${bg_dark_01};

                .tablink {
                    background-color: ${bg_dark_03};

                    &:focus,
                    &:focus-within,
                    &:hover,
                    &.is-active {
                        color: ${white};
                        background-color: ${success};
                    }
                }
            }

            ${TabsContent} {
                border-color: ${success};
    
                .lx-table {
                    &.is-striped {
                        tbody {
                            tr {
                                &:nth-child(odd) {
                                    background-color: ${bg_dark_03};
                                }
                            }
                        }
                    }
                }
            }

            .lx-pagination-item {
                color: white;
                background-color: ${bg_dark_01};
                border-color: white;
            }

            .notices .empty {
                background-color: ${bg_dark_03};
            }
        }

        #return {
            color: ${white};
            font-weight: 700;
            background-color: ${brand};
            padding: 0.5rem 1rem;
            margin-bottom: 1rem;
            box-shadow: none;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    ${
    window.innerWidth <= 1366 && `
            .lx-container-70 {
                width: 85%;
            }
        `
    }
`

export const HeaderElem = styled.header`
    height: 5rem;
    width: 100%;
    position: relative;

    a,
    button {
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    nav {
        &#nav-top {
            background-color: ${bg};
            height: 5rem;
            width: 100%;
            padding: ${window.innerWidth > 1024 ? "0.5rem 15%" : "0.5rem 5%"};
            box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.06), 0 0.125rem 0.375rem rgba(0, 0, 0, 0.06),0 0.1875rem 0.5rem rgba(0, 0, 0, 0.09);
            position: fixed;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 3;

            .brand {
                height: 100%;
                width: 8rem;
                display: grid;
                place-items: center;

                img,
                svg {
                    object-fit: contain;
                }
            }

            .actions {
                height: 100%;
                width: fit-content;
                display: grid;
                grid-auto-flow: column;
                gap: 1rem;
                place-items: center;

                a,
                button {
                    color: ${brand};
                    font-size: 1.4rem;
                    padding: 1rem;
                    border-radius: 0.25rem;
                    transition: 0.5s;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &:focus,
                    &:hover {
                        background-color: darken(white, 5%);
                    }
                }
            }
        }

        &#nav-offcanvas {
            background-color: ${bg};
            height: 100vh;
            ${window.innerWidth > 1024 ? `
                width: calc(15% - 1rem);
                padding: 1rem;
                right: -15%;
            ` : `
                width: 50%;
                padding: 6rem 1rem 1rem 1rem;
                right: -50%;
            `}
            box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.06), 0 0.125rem 0.375rem rgba(0, 0, 0, 0.06),0 0.1875rem 0.5rem rgba(0, 0, 0, 0.09);
            position: fixed;
            top: 0;
            display: grid;
            grid-auto-rows: max-content;
            gap: 0.5rem;
            transition: 0.5s;
            z-index: 2;

            a,
            button {
                font-size: 1.1rem;
                text-align: left;
                width: 100%;
                padding: 1rem;
                border-radius: 0.25rem;
                transition: 0.5s;
                display: flex;
                align-items: center;

                svg {
                    color: ${brand};
                }

                &.accordion {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    &:after {
                        content: "\f105";
                        font-family: "Font Awesome 5 Solid";
                        font-weight: bold;
                        display: none;
                    }

                    &.active {
                        &:after {
                            content: "\f107";
                        }
                    }
                }

                &:focus,
                &:hover {
                    background-color: darken(white, 5%);
                }
            }

            .panel {
                max-height: 0;
                padding: 0 0 0 1rem;
                display: grid;
                grid-auto-rows: max-content;
                overflow: hidden;
                transition: max-height 0.3s ease-out;

                a,
                button {
                    font-size: 0.9rem;
                    ${window.innerWidth < 900 ? "padding: 0.75rem;" : ""}
                }
            }

            &.is-active {
                right: 0;
            }
        }
    }
`

export const InputWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-flow: nowrap;
    align-items: stretch;
    justify-content: center;
`

export const Icon = styled.span`
    color: ${form_text};
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
    background-color: ${form_icon_bg};
    width: fit-content;
    padding: 0.375rem 0.75rem;
    margin: 0;
    border-top-left-radius: 0.25em;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0.25em;
    border-bottom-right-radius: 0;
    display: flex;
    align-items: center;

    ${InputWrapper}:hover &,
    ${InputWrapper}:focus &,
    ${InputWrapper}:focus-within & {
        color: ${brand};
    }
`

export const InputElem = styled.input`
    color: ${form_text};
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    min-height: 3rem;
    padding: 0.375rem 0.75rem;
    border: 0.0625rem solid ${form_border};
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 0.25em;
    border-bottom-right-radius: 0.25em;
    border-left: 0;
    display: block;
    flex-grow: 1;
`

export const Label = styled.label`
    font-size: 1.2rem;
    font-weight: 700;
    width: 100%;
    margin-bottom: 1rem;
`

export const Loader = styled.div`
    height: 30px;
    width: 30px;
    margin: 15px auto 0;
    border: 16px solid #eff0f1;
    border-top: 16px solid ${success};
    border-radius: 50%;
    position: relative;
    animation: ${spin} 1s linear infinite;
    z-index: 4;
`

export const LoaderWrapper = styled.div`
    background-color: rgba(255,255,255,0.25);
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`

export const Main = styled.main`
    min-height: calc(100vh - 5rem - 60px);
    padding: 2rem 0;
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: min-content;
    gap: 1rem;
    ${props => props.login && "place-content: center;"}
`

export const OrderButton = styled.button.attrs(props => ({ className: "lx-btn" }))`
    color: white;
    font-weight: 700;
    background-color: ${success};
    box-shadow: none;
`

export const Text = styled.div`
    font-size: 1rem;
    text-align: ${props => props.center ? "center" : "left"};

    ${props => props.login && `
        p {
            a {
                text-decoration: underline;

                &:hover,
                &:focus {
                    color: ${brand};
                }
            }
        }
    `}
`

export const Title = styled.h1`
    color: ${brand};
    font-size: 1.6rem;
    text-align: ${props => props.center ? "center" : "left"};
    margin-bottom: 1rem;
`

export const SearchRow = styled.div.attrs(props => ({ className: "lx-grid" }))`
    ${window.innerWidth < 900 ? `
        grid-template-columns: 1fr;
        grid-template-areas: "input";
    ` : `
        grid-template-columns: repeat(3, 1fr);
        grid-template-areas: "none none input";
    `}
`

export const Subtitle = styled.h1`
    color: ${brand};
    font-size: 1.3rem;
    text-align: left;
    margin: 1rem 0;
`

export const ModalCard = styled.div`
    background-color: white;
    ${window.innerWidth > 900 ? "max-width: 80%;" : ""}
    min-width: 60%;
    width: fit-content;
    max-height: 60%;
    min-height: 30%;
    height: fit-content;
    ${window.innerWidth < 900 ? "margin: 0 2rem;" : ""}
    position: fixed;
    top: 20%;
    left: ${window.innerWidth > 900 ? "20%" : "0"};
    display: grid;
    grid-template-rows: auto 1fr;
    grid-auto-flow: row;
    gap: 1rem;
    overflow-y: auto;
`

export const ModalContainer = styled.div`
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    animation: ${swing_in_top_fwd} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
    z-index: 1;
`

export const ModalContent = styled.div`
    margin-bottom: 2rem;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-auto-flow: row;
    gap: 2rem;

    .row {
        display: grid;
        grid-auto-flow: row;
        gap: 1rem;
    }

    ${Title},
    ${Subtitle} {
        margin: 0;
    }

    ${Title} {
        font-size: 1.5rem;
    }

    table {
        overflow: hidden;
        border-radius: 0.328em;

        tr {
            th,
            td {
                border-radius: 0;
            }

            th {
                text-transform: uppercase;
                font-weight: 700;
            }

            td {
                a {
                    span {
                        &:last-child {
                            text-decoration: underline;
                        }
                    }
                }

                .lx-btn {
                    max-width: 5rem;
                    margin: 0;
                    padding: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    color: white;
                    box-shadow: none;

                    &.edit {
                        background-color: ${brand};
                    }

                    &.delete {
                        background-color: ${danger};
                    }
                }
            }
        }

        ${window.innerWidth <= 900 && `
            .table-row {
                width: 100%;
                overflow-x: auto;
                table {
                    width: max-content;
                }
            }
        `}
    }

    .actions {
        gap: 1rem;
    }
`

export const ModalHeader = styled.div`
    padding: 2em 1em 0.5rem;
    ${window.innerWidth > 900 ? `
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 1fr 4rem;
    ` : `
        display: flex;
        flex-direction: column-reverse;
        align-items: flex-end;
    `}
    z-index: 2;
    

    ${Title} {
        font-size: ${window.innerWidth > 900 ? "2rem" : "1.6rem"};
        margin: 0;
    }

    .lx-btn {
        font-size: 1.5rem;
        padding: 0;
        margin: 0;
        box-shadow: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &:focus,
        &:hover {
            color: ${brand};
        }
    }
`

export const SelectElem = styled.select`
    color: ${form_text};
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    min-height: 3rem;
    padding: 0.375rem 0.75rem;
    border: 0.0625rem solid ${form_border};
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 0.25em;
    border-bottom-right-radius: 0.25em;
    border-left: 0;
    display: block;
    flex-grow: 1;
`

export const SelectWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr${window.innerWidth > 900 ? " auto" : ""};
    grid-template-areas: ${window.innerWidth > 900 ? `"select button"` : `"select" "button"`};
    align-items: flex-end;
    gap: 1rem;
`
