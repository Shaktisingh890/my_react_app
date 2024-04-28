import { colorList } from "consts/color";
import React, { useEffect, useState } from "react";
import {
  StyledButtonContainer,
  StyledRadioButton,
  StyledRadioLabel,
  StyledRadioContainer,
} from "./style";
import {
  FontWeight,
  Text,
  FontFamily,
  FontSize,
} from "app/components/atoms/text";

export interface IRadioFieldType {
  label: string;
  value: string;
}

export enum OrientationType {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

export interface IRadioButtonProps {
  radioButtonList: IRadioFieldType[];
  handleRadioChange?: Function;
  showBorder?: boolean;
  radioType?: OrientationType;
  backgroundColor?: string;
  defaultValue?: string; // pass value of selected label
}

export const RadioButtons = (props: IRadioButtonProps) => {
  const {
    radioButtonList,
    handleRadioChange,
    showBorder = false,
    radioType = OrientationType.Horizontal,
    backgroundColor = colorList.white1,
    defaultValue,
  } = props;

  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionSelection = (value: string) => {
    setSelectedOption(value);
    handleRadioChange && handleRadioChange(value);
  };

  useEffect(() => {
    if (defaultValue && defaultValue?.length > 0) {
      setSelectedOption(defaultValue);
    }
  }, [defaultValue]);

  return (
    <StyledRadioContainer radioType={radioType}>
      {radioButtonList?.map((item, index) => (
        <StyledButtonContainer
          key={index}
          showBorder={showBorder}
          radioType={radioType}
          selectedOption={item.value === selectedOption}
          backgroundColor={backgroundColor}
          onClick={() => handleOptionSelection(item.value)}
        >
          <StyledRadioButton selectedOption={item.value === selectedOption} />
          <StyledRadioLabel>
            <Text
              weight={FontWeight.SemiBold}
              family={FontFamily.Inter}
              size={FontSize.Small}
            >
              {item.label}
            </Text>
          </StyledRadioLabel>
        </StyledButtonContainer>
      ))}
    </StyledRadioContainer>
  );
};
