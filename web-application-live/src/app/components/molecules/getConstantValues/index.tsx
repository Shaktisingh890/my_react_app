import React from "react";

import {
    getConstantLabel,
    ServerConstantKeys,
    useServerConstants,
} from "apiCalls/dashboard";
import Label from "app/components/atoms/label";
import { StyledLabel } from "./style"
interface Iprops {
    serverConstantKey: any;
    fieldArray?: string[];
    value?: string;
    textColor?: string;
    bgColor?: string;
}

export const GetConstantValues = (props: Iprops) => {
    const [constants] = useServerConstants(
        props.serverConstantKey
    )
    const { fieldArray, value, textColor, bgColor } = props;
    const serverString = value ? getConstantLabel(value, constants) : ""

    return (
        <StyledLabel>
            {fieldArray?.map((item, i) => (
                <Label
                    key={i}
                    bgColor={bgColor}
                    textColor={textColor}
                    field={getConstantLabel(item, constants)} />
            ))}
            {serverString}
        </StyledLabel>

    )

}