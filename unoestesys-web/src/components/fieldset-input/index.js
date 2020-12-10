import React from "react"
import { Fieldset, Icon, InputElem, InputWrapper, Label } from "../index"

function Input({ helper, icon, id, label, ...rest }) {
    return (
        <Fieldset>
            {label && <Label htmlFor={id}>{label}</Label>}
            <InputWrapper>
                <Icon>{icon}</Icon>
                <InputElem {...rest} name={id} id={id} />
            </InputWrapper>
            <div id={`${id}-helper`} className="helper">{helper}</div>
        </Fieldset>
    )
}

export default Input