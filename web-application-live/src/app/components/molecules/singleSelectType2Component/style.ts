import { images } from "assets/images";
import { colorList } from "consts/color";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
  background: ${colorList.white1};
  border: 1px solid ${colorList.variant2};
  border-radius: 0.3125rem;
`;

export const StyledIcon = styled.div`
  margin-left: 0.875rem;
  width: 0.5rem;
  height: 0.5rem;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  fill: white;
  background-image: url(${images.crossWhite});
`;

export const StyledIconPlus = styled.div`
  margin-left: 0.875rem;
  width: 0.5rem;
  height: 0.5rem;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  fill: white;
  background-image: url(${images.plus});
`;

interface IContainerprops {
  valid: boolean;
}

export const SelectFromItem = styled.div`
  background: ${colorList.variant3};
  padding: 0.6rem 0.75rem;
  margin: 0.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  justify-content: space-between;
  border-radius: 0.3125rem;
  cursor: pointer;
`;

export const SelectedOption = styled.div`
  padding: 0.6rem 0.75rem;
  margin: 0.2rem;
  color: white;
  background: ${colorList.blue5};
  border-radius: 0.3125rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  justify-content: space-between;
  cursor: default;
`;

export const LeftConainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
`;
export const RightContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;

  .emptyContainer {
    border: 1px dashed ${colorList.variant2};
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    opacity: 0.8;
  }
`;

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.5rem 0;

  & > div {
    margin-right: 0.2rem;
  }
`;
