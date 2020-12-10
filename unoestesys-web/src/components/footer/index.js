import React from "react"
import { FaCode } from "react-icons/fa"
import styled from "styled-components"

const FooterElem = styled.footer`
    ${window.innerWidth < 900 ? "font-size: 1rem;" : ""}
    height: 60px;
    width: 100%;
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

const Footer = () => {
    return (
        <FooterElem className="bs-md">
            <div className="lx-container-70">
                <div className="lx-row is-end">
                    <p>
                        <FaCode />&nbsp;&nbsp;Versão 0.1.0 - Alpha
                    </p>
                </div>
            </div>
        </FooterElem>
    )
}

export default Footer