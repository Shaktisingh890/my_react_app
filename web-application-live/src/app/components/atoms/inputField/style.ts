import styled from "styled-components";
import { colorList } from "consts/color";
import { images } from "assets/images";

interface IInputProps {
  valid: boolean;
  hideDisplay?: boolean;
  showBorder?: boolean;
}
interface IIconProps {
  showPwd: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .label {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
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

export const PasswordContainer = styled(StyledContainer)<IInputProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 0.3125rem;
  overflow: hidden;
  border: ${({ valid }) =>
    valid ? `1px solid ${colorList.variant2}` : `1px solid ${colorList.red1}`}};

  .passwordIcon {
    background: ${colorList.white1};
    padding: 1.125rem;
    display: flex;
    align-items: center;
  }
`;

export const StyledInput = styled.input<IInputProps>`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  outline: none;
  width: 100%;
  display: ${({ hideDisplay }) => hideDisplay && "none"};
  color: ${colorList.grey2};
  background: ${colorList.white1};
  border: ${({ valid, showBorder }) =>
    showBorder
      ? valid
        ? `1px solid ${colorList.variant2}`
        : `1px solid ${colorList.red1}`
      : "none"};
  width: ${(props) => (props.width ? props.width : "100%")};
`;

export const StyledPasswordInput = styled(StyledInput)`
  border: none;
`;

export const StyledIcon = styled.div<IIconProps>`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: ${({ showPwd }) =>
    showPwd ? `url(${images.eye})` : `url(${images.eyeOff})`};
`;

export const FileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${colorList.white1};
  border: 1px solid ${colorList.variant2};
  padding: 1rem 1.5rem;
  border-radius: 5px;

  .buttonRightContainer {
    display: flex;
    justify-content: flex-end;

    & > button {
      margin-right: 0.5rem;
    }
  }

  .buttonLeftContainer {
    display: flex;
    justify-content: flex-start;

    & > button {
      margin-right: 0.5rem;
    }
  }

  .loading {
    height: 5rem;
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  & > div {
    margin-right: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .nameContainer {
    display: flex;
    flex-direction: column;
  }

  .fileNameContainer {
    max-width: 5rem;
  }
`;

export const StyledFile = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid ${colorList.variant2};
  margin-bottom: 0.5rem;

  .cross-icon {
    margin-bottom: 4.5rem;
    margin-right: -1.5rem;
    background-color: ${colorList.black1};
    border: 1px solid ${colorList.white2};
    border-radius: 50%;
  }
`;

export const StyledImage = styled.img`
  width: 3.5rem;
  height: 3.5rem;
`;

export const SubtitleText = styled.div`
  padding: 1rem;
`;
