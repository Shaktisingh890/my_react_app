import React from "react";
import { StyledTag, AlignedTag } from "./style";
import { Text, FontFamily, FontSize, FontWeight } from "../text";

interface IText {
  fieldArr: string[];
  backGroundColor?: string;
  textColor?: string;
}

export default function Tag(props: IText) {
  const { fieldArr, backGroundColor, textColor } = props;
  return (
    <AlignedTag>
      {fieldArr &&
        fieldArr.map((name, i) => (
          <StyledTag backGroundColor={backGroundColor} key={i}>
            <Text
              family={FontFamily.Inter}
              weight={FontWeight.Medium}
              size={FontSize.ExtraSmall}
              color={textColor}
            >
              {name}
            </Text>
          </StyledTag>
        ))}
    </AlignedTag>
  );
}
