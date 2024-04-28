import { colorList } from "consts/color";
import styled from "styled-components";
import { Text } from "app/components/atoms/text";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 0;
  /* padding-bottom: 40px; */
  overflow: scroll;
  max-height: 100vh;
`;

export const Divider = styled.div`
  margin-top: 0.7rem;
`;
export const StyledHeader = styled.div`
  min-width: 40%;
  display: flex;
  padding: 0 40px;
  text-align: center;
  justify-content: space-between;
  margin-left: 25%;
`;

export const StyledDivider = styled.div`
  height: 1.5px;
  width: 100%;
  background: ${colorList.variant23};
  margin: 1rem 0rem;
`;

export const StyledLabelLeft = styled(Text)`
  display: inline;
  padding: 0.9rem;
  border-radius: 5px 0 0 5px;
  text-align: center;
  background: ${colorList.blue1};
`;

export const StyledIcon = styled.span`
  background: ${colorList.blue11};
  display: flex;
  text-align: center;
  border-radius: 0 5px 5px 0;
`;

export const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding: 0 8rem; */
`;

export const StyledImage = styled.img`
  display: block;
  margin: 0.8rem;
  width: auto;
`;

export const PaymentButtons = styled.div`
  display: flex;
`;

export const Gap = styled.div`
  margin-top: 2rem;
`;

export const MarginLeft = styled(Text)`
  margin-left: 2rem;
`;
