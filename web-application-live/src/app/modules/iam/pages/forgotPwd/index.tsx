import { publicPaths } from "consts/paths";
import React, { ReactElement, useEffect, useState } from "react";
import { TextArea } from "app/components/atoms/textArea";
import { InputField } from "app/components/atoms/inputField";
import { FontFamily, FontSize, FontWeight, Text } from "app/components/atoms/text";
import { colorList } from "consts/color";
import { Button } from "app/components/atoms/mybutton";
import { useHistory } from "react-router-dom";

import OnBoardingLeftSection from "../../organisms/onBoardingLeftSection";

import { Link } from "react-router-dom";

import { emailSchema } from "schema";

import {
    StyledContainer,
    StyledChildRight,
    StyledForm,
    ButtonWrapper,
    InputContainer,
    StyledFooter,
    BottomText
} from "./style";
import { forgotPassword } from "apiCalls/iam";
import Notify from "utils/notification";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import { getFromLocalStorage } from "localStorage";
export interface Iemail {
    email: string
}




export default function ForgotPwd(): ReactElement {
    const [email, setEmail] = useState<string>("")
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [accountType, setAccountType] = useState<string>("");

    const { t } = useTranslation();


    const handleEmailInput = (value: string) => {
        setEmail(value);
        emailSchema?.isValid(value).then(function (valid: boolean) {
            setIsEmailValid(valid);
        });
    };
    useEffect(() => {
        setAccountType(getFromLocalStorage('userRole'))

    }, [])
    const history = useHistory();

    const handleLoginButton = () => {
        history.push(publicPaths.login);
    };
    const handleSignUpButton = () => {

        history.push(publicPaths.serviceAccount);
    };

    const handleForgotPasswordButton = async () => {

        setLoading(true);

        try {
            const response = await forgotPassword({
                email
            });
            Notify({
                title: t(translations.API_ERRORS.FORGOT_PASSWORD),
                message: 'Email sent successfully. Please check your inbox.',
                type: "success",
            });
            history.push(publicPaths.login);

        } catch (error) {
            Notify({
                title: t(translations.API_ERRORS.FORGOT_PASSWORD),
                message: error + '',
                type: "danger",
            });
        } finally {
            setLoading(false);
        }
    };
    return (

        <StyledContainer>
            <OnBoardingLeftSection color={colorList.blueGradient} />
            <StyledChildRight>
                <StyledForm onSubmit={e => updateForm(e)}>

                    <Text size={FontSize.Large} weight={FontWeight.Light} family={FontFamily.Inter}>Forgot<br />Password</Text>
                    <div style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>
                        <Text
                            size={FontSize.Mini}
                            color={colorList.grey2}
                            weight={FontWeight.Light}
                            family={FontFamily.Inter}>
                            Enter your email address associated with your account. Once verified, you will receive a link to reset your password.
                        </Text>
                    </div>

                    <InputContainer>
                        <InputField
                            label={"Email address"}
                            type="email"
                            schema={emailSchema}
                            handleInputChange={handleEmailInput}
                            required />
                    </InputContainer>

                    <ButtonWrapper>
                        <Button textColor={colorList.white1}
                            color={colorList.blue1}
                            borderColor={colorList.blue1}
                            text={'Submit'}
                            disabled={!isEmailValid}
                            loading={loading}
                            onClick={handleForgotPasswordButton}></Button>
                    </ButtonWrapper>

                </StyledForm>
                <StyledFooter >
                    <div style={{ flex: 1, padding: '1rem 1.6rem' }}>
                        <BottomText size={FontSize.Small} color={colorList.darkGrey} weight={FontWeight.Medium} family={FontFamily.Inter}>
                            Already have an Expanter account?
                        </BottomText>
                        <Button
                            textColor={colorList.blue1}
                            color={colorList.white1}
                            borderColor={colorList.blue1}
                            text={'Log in'}
                            onClick={handleLoginButton}></Button>
                    </div>
                    <div style={{ flex: 1, padding: '1rem 1.6rem' }}>
                        <BottomText size={FontSize.Small} weight={FontWeight.Medium} color={colorList.darkGrey} family={FontFamily.Inter}>
                            I don’t have an Expanter account yet?
                        </BottomText>
                        <Button textColor={colorList.blue2}
                            color={colorList.white1}
                            borderColor={colorList.blue2}
                            text={'Create account'}
                            onClick={handleSignUpButton}></Button>
                    </div>
                </StyledFooter>
            </StyledChildRight>
        </StyledContainer>

    )

}

const updateForm = (event) => {
    event.preventDefault();
}


