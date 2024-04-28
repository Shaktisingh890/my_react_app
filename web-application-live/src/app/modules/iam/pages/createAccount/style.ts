import { Text } from "./../../../../components/atoms/text/index";
import styled from "styled-components";
import { images } from "assets/images";
import { colorList } from "consts/color";

interface IChildProps {
  margin: string
}

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

export const ImageContainer = styled.div`
  flex: 40%;
  background: linear-gradient(
    180deg,
    ${colorList.white3} 0%,
    ${colorList.blue4} 100%
  );
`;

export const StyledLogo = styled.div`
  width: 14.25rem;
  height: 2rem;
  margin: 2.5rem 3rem;
  position: absolute;
  z-index: 2;
  background: url(${images.expanterIconPurple});
`;

export const StyledImage = styled.span`
  position: absolute;
  top: 18vh;
  z-index: 2;
  width: 18.75rem;
  height: 37.5rem;
  background: url(${images.semiSphere});
  margin-left: calc(40% - 18.75rem);
  mix-blend-mode: overlay;
`;

export const StyledChild = styled.div`
  flex: 60%;
  flex-direction: column;
  justify-content: space-between;
  background: ${colorList.white2};

  .content {
    overflow-y: scroll;
    height: 90%;
  }
`;

export const ContentContainer = styled.div`
  margin: 2.5rem 6.25rem;
  width: 45%;

  .link {
    width: fit-content;
    cursor: pointer;
  }

  .greyColor {
    margin-left: 0.875rem;
    color: ${colorList.grey1};
  }

  .buttonContainer {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 1600px) {
    width: 51%;
  }

  @media (max-width: 1300px) {
    width: 60%;
  }

  @media (max-width: 1100px) {
    width: 67%;
  }

  @media (max-width: 1000px) {
    margin: 2rem;
    width: 80%;
  }

  @media (max-width: 850px) {
    margin: 2rem 1rem;
    width: 90%;
  }
`;

export const Divider = styled.div<IChildProps>`
  margin: ${({ margin }) => margin};
`;

export const ContentFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 60%;
  height: 10%;
  padding: 1.125rem 1.5rem;
  border-top: 1px solid ${colorList.grey4};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: ${colorList.white2};
`;
export const StyledFont = styled(Text)`
  float: left;
  margin-right: 1rem;
`;
export const StyledRadioButtons = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const StyledWidth = styled.div`
  width: 85%;
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
`;
