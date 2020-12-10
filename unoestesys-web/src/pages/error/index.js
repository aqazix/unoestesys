import React from "react"
import { Link } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { Main, Text } from "../../components"

const glitch = keyframes`
    2%,
    64% {
        transform: translate(0.125rem, 0) skew(0deg);
    }
    4%,
    60% {
        transform: translate(-0.125rem, 0) skew(0deg);
    }
    62% {
        transform: translate(0, 0) skew(5deg);
    }
`

const glitchBottom = keyframes`
    2%,
    64% {
        transform: translate(-0.125rem, 0);
    }
    4%,
    60% {
        transform: translate(-0.125rem, 0);
    }
    62% {
        transform: translate(-1.375rem, 0.3125rem) skew(21deg);
    }
`

const glitchTop = keyframes`
    2%,
    64% {
        transform: translate(0.125rem, -0.125rem);
    }
    4%,
    60% {
        transform: translate(-0.125rem, 0.125rem);
    }
    62% {
        transform: translate(0.8125rem, -0.0625rem) skew(-13deg);
    }
`

const Error = styled.div`
    font-size: 6rem;
    letter-spacing: -0.437rem;
    text-shadow: 0.125rem 0.125rem rgba(255, 255, 255, 0.2);
    width: fit-content;
    position: relative;
    animation: ${glitch} 1s linear infinite;
    z-index: 2;

    &:before,
    &:after {
        content: attr(title);
        position: absolute;
        left: 0;
    }

    &:before {
        animation: ${glitchTop} 1s linear infinite;
        clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
    }

    &:after {
        animation: ${glitchBottom} 1.5s linear infinite;
        clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
    }
`

const Image = styled.div`
    filter: grayscale(1);
`

export default () => {
    return (
        <Main login>
            <div className="lx-row is-gapless">
                <Error title="404">404</Error>

                <Image>
                    <img src="https://media.giphy.com/media/6uGhT1O4sxpi8/giphy.gif" alt="" />
                </Image>
            </div>

            <div className="lx-row">
                <Text>
                    <p>
                        Essa página não existe.
                    </p>
                </Text>
            </div>

            <div className="lx-row">
                <Link to="/home" className="lx-btn" id="return"><i className="fas fa-reply"></i>&nbsp;&nbsp;Voltar</Link>
            </div>
        </Main>
    )
}