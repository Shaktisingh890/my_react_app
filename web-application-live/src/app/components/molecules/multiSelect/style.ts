import { images } from "assets/images";
import { colorList } from "consts/color";
import styled from "styled-components";

interface IIconprops {
  modalOpened: boolean;
}

interface IContainerprops {
  valid: boolean;
}

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.5rem 0;

  & > div {
    margin-right: 0.2rem;
  }
`;

export const SelectedItemsContainer = styled.div<IContainerprops>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: ${colorList.white1};

  border: ${({ valid }) =>
    valid ? `1px solid ${colorList.white4}` : `1px solid ${colorList.red1}`};
  box-sizing: border-box;
  border-radius: 0.3rem;
  padding: 0.5rem 0.75rem;
  position: relative;
  z-index: 1;

  .weight {
    stroke: ${colorList.blue1};
    stroke-width: 1px;
  }
`;

export const StyledSelect = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;

  .selectText {
    padding: 0.5rem;
  }
`;

export const SelectedOption = styled.div`
  padding: 0.6rem 0.75rem;
  margin: 0.2rem;
  background: ${colorList.variant3};
  border-radius: 0.3125rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  justify-content: space-between;
  cursor: default;
`;

export const StyledIcon = styled.div`
  margin-left: 0.875rem;
  width: 0.5rem;
  height: 0.5rem;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  background-image: url(${images.cross});
`;

export const OptionContainer = styled.div`
  border: 1px solid ${colorList.variant2};
  background: ${colorList.white1};
  box-sizing: border-box;
  border-radius: 0.3rem;
  width: 100%;
  max-height: 30%;
  max-width: 20rem;
  overflow: scroll;
  position: fixed;
  z-index: 7;
  margin: 0.2rem 0;

  & div:last-child {
    border: none;
  }

  .remainingText div {
    text-align: center;
    margin: 3rem 0;
  }
`;

export const StyledOption = styled.div`
  border-bottom: 1px solid ${colorList.variant2};
  padding: 0.5rem 0.75rem;
  cursor: pointer;

  &:hover {
    background-color: ${colorList.variant3};
  }
`;
