import React from 'react';
import {
  StyledTag,

} from './style'
import { Text, FontFamily, FontSize, FontWeight } from "../text";
import { colorList } from 'consts/color';

interface IText {
  field: string;
  url?: string;
  textColor?: string;
  bgColor?: string;

}

export default function Label(props: IText) {
  const {
    field,
    url,
    textColor = colorList.black1,
    bgColor
  } = props;
  return (

    <>
      <StyledTag bgColor={bgColor}>
        <Text
          family={FontFamily.Inter}
          weight={FontWeight.Medium}
          size={FontSize.ExtraSmall}
          color={textColor}
        >{field}</Text>
      </StyledTag>
      {url && <img src={url} height="15px" width="15px" />}
    </>

  )

}
