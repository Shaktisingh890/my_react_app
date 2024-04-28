import React from 'react';

//import third party libraries.
import { useTranslation } from 'react-i18next';
import { translations } from "locales/translations";
import Notify from 'utils/notification';
import { atom, useAtom } from 'jotai';

//import custom components.
import {
    StyledContainer1,
    StyledHeading,
    StyledIcon1,
    StyledDivider,
    StyledText1,
    Divider,
    ViewButton,
    StyledCancel,
} from "./style";
import { Text, FontFamily, FontSize, FontWeight } from "app/components/atoms/text";
import { hire } from 'apiCalls/proposalManagement';

//constant imports
import { colorList } from 'consts/color';

//images imports
import { images } from "assets/images/index"
import { isHired } from '../atomStore';


export default function Hire(props) {
    const {
        onClose,
        project,
        brandName,
        spName,
        proposalId,
        docs
    } = props;


    const { t } = useTranslation();
    const [, setHiredProposalId] = useAtom(isHired)


    const handleHireButton = async () => {

        try {
            const saveHireDetails = await hire({ proposalId, docs })
            setHiredProposalId(proposalId);
            Notify({
                title: "",
                message: spName + t(translations.SUCCESS_NOTIFY.HIRE),
                type: "success",
            });
            onClose();
        } catch (error) {
            Notify({
                title: "",
                message: error + "",
                type: "danger",
            });
        }


    }
    return (
        <div>
            <StyledContainer1>
                <StyledHeading
                    size={FontSize.Large}
                    weight={FontWeight.Regular}
                    family={FontFamily.Roboto}
                    color={colorList.blue9}
                >
                    {t(translations.HIRE.HEADING)}
                </StyledHeading>
                <Divider />
                <StyledIcon1>
                    <StyledDivider />
                    <img src={images.crossLogo} height="14px" width="14px" />
                    <StyledDivider />
                </StyledIcon1>
                <Divider />
                <div>
                    <StyledText1>{t(translations.HIRE.SUB_HEADING1)}
                        <b>{spName}</b>
                        {t(translations.HIRE.SUB_HEADING2)}
                        <b>{project}</b>
                    </StyledText1>
                </div>
                <Divider />
                {/* <StyledIcon2>
                    <BusinessName>
                        <Text
                            size={FontSize.Small}
                            weight={FontWeight.Bold}
                            family={FontFamily.Inter}
                            color={colorList.blue1}
                        >
                            {brandName}

                        </Text>

                    </BusinessName>
                    <div>
                        <StyledImage src={images.oppositeArrows} height="18px" width="22px" />
                        <img src={images.expanterIcon} height="60px" width="60px" />
                        <StyledImage src={images.oppositeArrows} height="18px" width="22px" />
                    </div>
                    <BusinessName>
                        <Text
                            size={FontSize.Small}
                            weight={FontWeight.Bold}
                            family={FontFamily.Inter}
                            color={colorList.blue1}
                        >
                            {spName}

                        </Text>

                    </BusinessName>

                </StyledIcon2> */}
                {/* <Divider /> */}

                <ViewButton onClick={handleHireButton}>
                    <Text
                        family={FontFamily.Inter}
                        size={FontSize.Regular}
                        color={colorList.white1}
                        weight={FontWeight.Bold}
                    >
                        {t(translations.BUTTONS.HIRE)}
                    </Text>
                </ViewButton>

                <Divider />
                <div onClick={onClose} role="button">
                    <StyledCancel
                        family={FontFamily.Inter}
                        size={FontSize.ExtraSmall}
                        color={colorList.black1}
                        weight={FontWeight.Bold}
                    >
                        {t(translations.HIRE.CANCEL)}
                    </StyledCancel>
                </div>
                <Divider />
            </StyledContainer1>
        </div>
    )
}
