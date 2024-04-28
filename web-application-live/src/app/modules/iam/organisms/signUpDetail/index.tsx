import React, { ReactElement, ReactPortal } from "react";
import {
  Text,
  FontFamily,
  FontWeight,
  FontSize,
} from "app/components/atoms/text";
import {
  StyledDivider,
  ButtonContainer,
  StyledContainer,
  StyledContent,
  StyledText,
  StyledHeader,
  StyledHeight
} from "./style";
import { colorList } from "consts/color";
import { useHistory } from "react-router-dom";
import { publicPaths } from "consts/paths";
import { Button } from "../../../../components/atoms/mybutton";

export interface IList {
  title: string;
  description: string;
}

interface IProps {
  children?: React.ReactElement;
  headerText: string;
  listContent: IList[];
  isFirstChild: boolean;
}

export default function SignUpDetail(props: IProps): ReactElement {
  const { children, headerText, listContent, isFirstChild } = props;
  const history = useHistory();

  const handleSignUpButton = () => {
    history.push(
      isFirstChild ? publicPaths.brandAccount : publicPaths.serviceAccount
    );
  };

  const handleLoginButton = () => {
    history.push(publicPaths.login, { type:  isFirstChild ? 'brand': 'service' });
  };

  return (
    <StyledContainer isFirstChild={isFirstChild}>
      {!!children && <div>{children}</div>}
      <StyledContent isFirstChild={isFirstChild}>
        <StyledHeader isFirstChild={isFirstChild}>
          <StyledText
            family={FontFamily.Inter}
            weight={FontWeight.Light}
            size={FontSize.Large}
            color={isFirstChild ? colorList.white1 : colorList.blue2}
          >
            {headerText}
          </StyledText>
        </StyledHeader>
        <StyledHeader isFirstChild={isFirstChild}>
          <StyledDivider />
        </StyledHeader>
        <StyledHeight>
          {listContent.map((list, index) => (
            <div key={index}>
              <Text
                family={FontFamily.Inter}
                weight={FontWeight.SemiBold}
                color={isFirstChild ? colorList.white1 : colorList.grey2}
              >
                {list.title}
              </Text>
              <Text
                family={FontFamily.Inter}
                size={FontSize.Small}
                color={isFirstChild ? colorList.white1 : colorList.grey2}
                styles={{ letterSpacing: "0.02em", margin: "0.5rem 0 2rem" }}
              >
                {list.description}
              </Text>
            </div>
          ))}
        </StyledHeight>
        <ButtonContainer isFirstChild={isFirstChild}>
          <Button
            text={"Sign up"}
            textColor={isFirstChild ? colorList.blue2 : colorList.blue6}
            borderColor={isFirstChild ? colorList.white1 : colorList.blue1}
            color={isFirstChild ? colorList.white1 : colorList.blue1}
            onClick={handleSignUpButton}
          />
          <Button
            text={"Log in"}
            textColor={isFirstChild ? colorList.white1 : colorList.blue1}
            borderColor={isFirstChild ? colorList.white1 : colorList.blue1}
            color={"transparent"}
            onClick={handleLoginButton}
          />
        </ButtonContainer>
      </StyledContent>
    </StyledContainer>
  );
}
