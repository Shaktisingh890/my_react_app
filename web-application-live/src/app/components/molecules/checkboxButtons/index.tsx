import React, { useEffect, useState } from "react";
import { OrientationType } from "../radioButtons";
import {
  StyledButtonContainer,
  StyledCheckButton,
  StyledCheckLabel,
  StyledCheckContainer,
} from "./style";

import {
  FontWeight,
  Text,
  FontFamily,
  FontSize,
} from "app/components/atoms/text";
import { colorList } from "consts/color";
import { Divider } from "./style";

export interface ICheckFieldType {
  label: string;
  value: string;
  selected: boolean;
}

export interface ICheckButtonProps {
  checkButtonList: ICheckFieldType[];
  handleCheckChange?: Function;
  checkType?: OrientationType;
  labelColor?: string;
  fontSize?: FontSize;
  subTitle?: string;
  color?: string;
  size?: FontSize;

}

export const CheckboxButtons = (props: ICheckButtonProps) => {
  const {
    checkButtonList,
    handleCheckChange,
    checkType = OrientationType.Horizontal,
    labelColor = colorList.grey2,
    fontSize = FontSize.Regular,
    color = colorList.grey1,
    size = FontSize.ExtraSmall,
    subTitle,
  } = props;

  const [selectedOption, setSelectedOption] = useState<ICheckFieldType[]>([]);

  useEffect(() => {
    if (checkButtonList.length > 0) {
      setSelectedOption(checkButtonList);
    }
  }, [checkButtonList]);

  const handleOptionSelection = (index: number) => {
    let tempArray = [...selectedOption];
    tempArray[index].selected = !tempArray[index].selected;
    setSelectedOption(tempArray);
    handleCheckChange && handleCheckChange(tempArray);
  };

  return (
    <StyledCheckContainer checkType={checkType}>
      {selectedOption?.map((item, index) => (
        <StyledButtonContainer key={index} checkType={checkType}>
          <StyledCheckButton
            selectedOption={item.selected}
            onClick={() => handleOptionSelection(index)}
          />
          <StyledCheckLabel>
            <Text
              weight={FontWeight.Regular}
              family={FontFamily.Roboto}
              size={fontSize}
              color={labelColor}
            >
              {item.label}
            </Text>
            <Divider />
            {!!subTitle && (
              <Text
                weight={FontWeight.Regular}
                family={FontFamily.Roboto}
                size={size}
                color={color}
              >
                {subTitle}
              </Text>
            )
            }
          </StyledCheckLabel>

        </StyledButtonContainer>
      ))}
    </StyledCheckContainer>
  );
};
