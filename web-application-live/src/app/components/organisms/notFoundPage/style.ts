import styled from "styled-components";
import { colorList } from "consts/color";
import { images } from "assets/images";

export const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  // background-color: ${colorList.white1};

  .logo-container {
    padding: 1rem 1.25rem;
    height: 4rem;
  }

  .text-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100% - 4rem);
    background-color: ${colorList.white6};
  }

  .text {
    max-width: 40%;
    text-align: center;

    & > div {
      margin-bottom: 2rem;
    }
  }
`;

export const StyledLogo = styled.div`
  width: 14.2rem;
  height: 2rem;
  background: url(${images.expanterIconPurple});
`;
