 import React from 'react';
import {StyledTag,
  AlignedTag
} from './style'
import {Text,FontFamily,FontSize,FontWeight} from "../text";
import {images} from "assets/images";

interface IText{
    fieldArr:[
        {mimeType:string,
        fileType:string,
        original:string,
        thumbnail:string
        }
    ]
}



export default function FileTag(props:IText) {
    const {fieldArr} = props;
 
  return (
      <div>
        {fieldArr && fieldArr.map((name,i) => {
          <img src={name['original']} height="30px" width="30px"/>
        }
        )} 
      </div>
  )
  
}
