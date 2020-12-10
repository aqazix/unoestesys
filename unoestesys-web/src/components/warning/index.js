import React, { useEffect } from "react"
import styled, { keyframes, css } from "styled-components"
import { danger, form_text, Text } from "../index"

const diminish = keyframes`
    0% {
        width: 100%
    }
    100% {
        width: 0%
    }
`

const animation = css`
    animation: ${diminish} 3.1s infinite linear;
`

const Warning = styled.div`
    background-color: white;
    max-width: ${window.innerWidth > 900 ? "20vw" : "80vw"};
    min-width: 10vw;
    padding: 1em 3em;
    position: fixed;
    bottom: -100%;
    right: 10px;
    opacity: 0;
    transition: bottom 0.3s ease-in-out, opacity 0.15s ease-in-out;
    z-index: 999;

    ${Text} {
        color: ${form_text};
    }

    .border-top {
        background-color: ${danger};
        height: 3px;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        ${animation}
    }

    &.is-active {
        opacity: 1;
        bottom: ${window.innerWidth > 900 ? "10px" : "2.5vw"};
    }
`

export default ({ warning }) => {
    useEffect(() => {
        if (warning !== "") {
            document.querySelector(".warning-popup").classList.add("is-active")

            setTimeout(() => {
                document.querySelector(".warning-popup").classList.remove("is-active")
            }, 3000)
        }
    }, [warning])

    return (
        <Warning warning={warning} className="warning-popup">
            {warning && <div className="border-top"></div>}
            <Text>{warning ? warning : "Tudo ok."}</Text>
        </Warning>
    )
}