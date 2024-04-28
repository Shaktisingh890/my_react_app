import React, { useEffect, useState } from 'react';
import { colorList } from "consts/color";
import {
    FontFamily,
    FontSize,
    FontWeight,
    Text,
} from "app/components/atoms/text";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import Notify from "utils/notification";

import {
    StyledLabel,
    SpaceBetween,
    Margin
} from "./style";
import { images } from 'assets/images';

export default function ViewText(props: any) {
    const { t } = useTranslation();
    const [copyIconLabel, setCopyIconLabel] = useState<string>(translations.GENERIC.COPY)

    function onCopyIconClick() {
        setCopyIconLabel("copied!");
    }

    // onMouse ={() => { setCopyIconLabel("copied! ") }}
    useEffect(() => {


    }, [])

    const copyToDashboard = (txt) => {
        navigator.clipboard.writeText(txt);
        setCopyIconLabel("copied!");
        ReactTooltip.hide();
        setTimeout(() => {
            setCopyIconLabel("copy");
        }, 2000);
        Notify({
            title: "",
            message: "copied to clipboard!",
            type: "success",
        });
        return null;
    }


    return (
        <div>
            <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
                {t(props.labelKey)}
            </StyledLabel>
            {props.formFields[props.formKey] ? (
                <SpaceBetween >

                    <div id="textToCopy" style={{
                        fontSize: "16px",
                        fontFamily: "Inter",
                        fontWeight: "500"
                    }}>{props.formFields[props.formKey]}
                    </div>
                    {props?.copyIcon && <Margin id="cIcon"
                    >
                        <>
                            <a className="show-underline" data-tip={t(copyIconLabel)}
                                // onClick={onCopyIconClick}
                                onClick={() => copyToDashboard(props.formFields[props.formKey])}
                            // onMouseOut={() => { setCopyIconLabel("copy") }}
                            >
                                <img src={images.copy} width="15px" height="15px"
                                />
                            </a>
                            <ReactTooltip id={props.formFields[props.labelKey]} place="top" type="dark" effect="float" />
                        </>
                    </Margin>}
                </SpaceBetween>
            ) : (
                <Text
                    weight={FontWeight.Medium}
                    family={FontFamily.Inter}
                    color={colorList.grey4}
                    size={FontSize.Small}
                >
                    {t(translations.VIEW_PROFILE.NO_CONTENT)}
                </Text>
            )}
        </div>
    )

}
