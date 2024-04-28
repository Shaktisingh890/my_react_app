import React, { useState, useEffect } from 'react';
import { verifyEmail } from 'apiCalls/iam';
import { publicPaths } from 'consts/paths';
import { useHistory } from 'react-router-dom';
import {

    FontSize,
    FontFamily,
    FontWeight
} from 'app/components/atoms/text';
import { StyledText1, StyledBox } from './style';
import { colorList } from 'consts/color';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { StyledText } from '../changePwd/style';
import { useLocation } from 'react-router-dom';
import OnBoardingLeftSection from '../../organisms/onBoardingLeftSection';

export default function EmailVerification() {
    const [loading, setLoading] = useState<boolean>(false);
    const [isValidEmail, setIsValidEmail] = useState<boolean>(false);


    const { t } = useTranslation();
    const history = useHistory();
    const search = useLocation().search;
    const token = new URLSearchParams(search).get("token") || "";

    useEffect(() => {

        const handleVerifyEmail = async () => {

            setLoading(true);
            try {
                const data = await verifyEmail(token);
                if (data) {
                    history.push(publicPaths.login)
                    setIsValidEmail(true);
                }

            }
            catch (error) {
                setLoading(false);
                setIsValidEmail(false);
            }
        }

        handleVerifyEmail();

    }, [])
    return (<div >
        {!isValidEmail &&

            (<StyledBox>

                <OnBoardingLeftSection />
                <StyledText1>
                    <StyledText
                        size={FontSize.Large}
                        weight={FontWeight.Light}
                        family={FontFamily.Inter}
                        color={colorList.grey1}
                    >
                        {t(translations.VALIDATION_ERRORS.COULDNOT_VERIFY)}
                    </StyledText>
                </StyledText1>

            </StyledBox>
            )
        }
    </div>


    )
}
