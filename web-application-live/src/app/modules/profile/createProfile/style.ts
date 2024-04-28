import styled from "styled-components";
import { images } from "assets/images";
import { colorList } from "consts/color";

interface IChildProps {
  margin: string;
}

export const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: ${colorList.white2};
`;

export const StyledLogo = styled.img`
  margin: 0.9rem 1.375rem;
  width: 2rem;
  height: 2rem;
  border-radius: 0.625rem;
  background: url(${images.expanterIcon});
  display: block;
  margin-left: auto;
`;

export const HeadingContainer = styled.div`
  flex: 30%;
  background: url(${images.maskGroup});
  background-repeat: no-repeat;
  background-size: 90%;
  mix-blend-mode: normal;
  padding: 4rem;
  padding-right: 0;
  .spacing {
    margin-left: 0.5rem;
    cursor: pointer;
  }
`;

export const FormContainer = styled.div`
  flex: 70%;

  .symbol {
    color: ${colorList.red1};
  }

  .formFields {
    padding: 4rem;
    padding-top: 0;
  }
`;

export const Divider = styled.div<IChildProps>`
  margin: ${({ margin }) => margin};
`;

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  & > *:not(:last-child) {
    display: block;
    margin-right: 1.5rem;
  }
`;

export const StyledDivider = styled.div`
  background: rgba(71, 105, 249, 0.2);
  height: 1px;
  margin: 3rem 0;
`;

export const Footer = styled.div`
  margin-top: 2.5rem;
  padding: 2.5rem 0;
  // border-top: 1px solid rgba(71, 105, 249, 0.2);
  display: flex;
  justify-content: flex-end;
`;
