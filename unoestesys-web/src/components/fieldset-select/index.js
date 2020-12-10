import React from "react"
import { Fieldset, Icon, SelectElem, InputWrapper, Label } from "../index"

function Select({ helper, icon, id, label, options, ...rest }) {
    return (
        <Fieldset select>
            {label && <Label htmlFor={id}>{label}</Label>}
            <InputWrapper>
                <Icon>{icon}</Icon>
                <SelectElem {...rest} name={id} id={id}>
                    <option value="" defaultChecked hidden>Selecione uma opção</option>
                    {options.map(option => {
                        return <option key={option.value} value={option.value}>{option.label}</option>
                    })}
                </SelectElem>
            </InputWrapper>
            <div id={`${id}-helper`} className="helper"><p>{helper}</p></div>
        </Fieldset>
    )
}

export default Select