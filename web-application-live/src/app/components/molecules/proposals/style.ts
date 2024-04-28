import { FlexWrap } from "./../myMultipleValues/style";
import { Button } from "./../../atoms/mybutton/index";
import styled from "styled-components";
import { colorList } from "consts/color";
import { Text } from "app/components/atoms/text";

interface IChildrenProp {
  isFaded: boolean;
}
export const StyledContainer = styled.div`
  border: 2px solid ${colorList.variant7};
  margin-top: 2rem;
  border-radius: 5px;
  .popup-overlay {
    background: rgba(0, 0, 0, 0.5);
  }
`;
export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  background: white;
`;

export const ProgressBar1 = styled.div`
  flex: 1;
  justify-content: space-between;
  display: flex;
  align-items: center;
  margin-left: 2rem;
  margin-right: 2rem;
`;
export const ProgressBar2 = styled.div`
  flex: 1;
  justify-content: space-between;
  display: flex;
  align-items: center;
  margin-top: 2rem;
`;

export const StyledLogo = styled.img`
  border: 1px solid black;
  border-radius: 50%;
`;

export const StyledFooter = styled.div`
  border-top: 1px solid ${colorList.variant7};
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;

  /* display: flex; */
`;
export const StyledTextWrapper = styled.div`
  /* width: 70%; */
  margin-left: 2rem;
`;
export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;
export const StyledText = styled(Text)`
  display: inline;
  margin-right: 6.5px;
  .show-underline {
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StyledImage = styled.img`
  height: 14.89px;
  width: 15.58px;
  margin-left: 6px;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex: 1;
  .logo-container {
    background-color: ${colorList.white1};
    border-radius: 50%;
    padding: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4rem;
    height: 4rem;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  & > *:not(:last-child) {
      margin-right: 0.7rem;
    }
`;
export const BigButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  /* width: 260px; */
`;

export const ViewButton = styled.button`
  outline: none;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: ${colorList.green1};
  padding: 0.8rem 3.7rem;
`;

export const StyledViewButton = styled.button`
  outline: none;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  min-width: 7.5rem;
  background-color: ${colorList.blue1};
  padding: 0.8rem 1rem;

`;

export const FooterDiv = styled.div`
  display: flex;
  flex-direction: column; ;
`;

export const StyledLabel = styled(Text)`
  margin-bottom: 0.3rem;
`;

export const UserLogo = styled.img`
  height: 5.5rem;
  width: 5.5rem;
  background-color: white;
  border-radius: 50%;
  object-fit: contain;
  border: 1px solid ${colorList.grey4};
`;

export const Divider = styled.div`
  margin-top: 0.375rem;
`;

export const StyledSmallContainer = styled.div`
  max-width: 40%;
  /* display: flex;
  flex-wrap: wrap; */
`;
export const StyledWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
export const Status = styled.img`
  height: 1.7rem;
  width: 1.7rem;
  border-radius: 50%;
  object-fit: contain;
`;
export const StyledLine = styled.img<IChildrenProp>`
  height: 3px;
  display: flex;
  background: ${({ isFaded }) => (isFaded ? colorList.grey4 : colorList.blue1)};
  flex: 1;
`;
export const Gap = styled.img`
  margin-top: 2rem;
`;

export const PayementStatic = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 3rem;
`;
export const PayementStaticChild1 = styled.div`
  display: flex;
  margin-left: 3rem;
  align-items: center;
`;

export const PayementHeadings = styled.div`
  display: flex;
  justify-content: space-between;
`;
