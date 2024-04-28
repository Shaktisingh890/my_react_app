import styled from "styled-components";
import { images } from "assets/images";
import { colorList } from "consts/color";
import { media, deviceMax } from "styles/media";

interface IChildProps {
  isFirstChild: boolean;
}

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  @media ${deviceMax.mobileL} {
    flex-direction: column;
  }
`;

export const StyledChild = styled.div<IChildProps>`
  flex: 50%;
  background: ${({ isFirstChild }) =>
    isFirstChild
      ? `linear-gradient(180deg, ${colorList.blue2} 0%, ${colorList.blue5} 100%)`
      : `linear-gradient(180deg, ${colorList.white3} 0%, ${colorList.blue4} 100%)`};

  @media ${deviceMax.mobileL} {
    flex: 100%;
  }
  position: relative;
`;

export const StyledImage = styled.div<IChildProps>`
  width: 18.75rem;
  height: 37.5rem;
  mix-blend-mode: overlay;
  position: absolute;
  top: 18vh;
  z-index: 3;
  right: ${({ isFirstChild }) => (isFirstChild ? 0 : null)};
  background: ${({ isFirstChild }) =>
    isFirstChild
      ? `url(${images.leftCircle}) no-repeat right`
      : `url(${images.rightCircle}) no-repeat left`};
`;

export const StyledLink = styled.div`
  position: absolute;
  top: 0;
  z-index: 2;
  margin: 1.375rem;
  cursor: pointer;
`;

export const StyledLogo = styled.img`
  margin: 0.9rem 1.375rem;
  width: 2rem;
  height: 2rem;
  border-radius: 0.625rem;
  background: url(${images.expanterIcon});
`;

export const StyledWrapper = styled(StyledContainer)`
  position: absolute;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  align-items: end;
`;
