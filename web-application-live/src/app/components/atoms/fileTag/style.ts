import { colorList } from "consts/color";
import styled from "styled-components";

export const StyledTag = styled.div`
    padding: 14px 16px;
    border-radius:5px;
    margin-right: 4px;
    background-color:${colorList.white6};
`;

export const AlignedTag = styled.div`
display: flex;
flex-direction:row;
`;