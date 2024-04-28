import { Text } from "app/components/atoms/text";
import { colorList } from "consts/color";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 40px;
  overflow: scroll;
  max-height: 100vh;
`;

export const StyledHeader = styled.div`
  min-width: 40%;
  display: flex;
  justify-content: space-between;
  margin-left: 37%;
`;

export const StyledDivider = styled.div`
  margin-bottom: 0.8rem;
`;

export const StyledCommission = styled.div`
  padding: 1rem;
  background: ${colorList.variant22};
`;

export const FooterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const FooterButtons = styled.div`
  /* width: 45%; */
  padding: 0.6rem 0rem;
  display: flex;
  justify-content: flex-end;
  & > *:not(:last-child) {
      margin-right: 1rem;
    }
`;

export const StyledTotalAmount = styled.div`
  width: 50%;
  display: flex;
  align-items: flex-start;
`;

export const Amounts = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SubtitleText = styled.div`
  padding: 1rem;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items:center ;
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

export const UserLargeLogo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid ${colorList.grey4};
`;

export const Divider = styled.div`
  margin-top: 0.7rem;
`;

export const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledPartition = styled.div`
  width: 50%;
`;

export const StyledTextWrapper = styled.div`
  margin-left: 1rem;
`;

export const MarginLeft = styled(Text)`
  margin-left: 0.6rem;
`;
export const StyledLine = styled.div`
  width: 100%;
  background: ${colorList.variant24};
  height: 1.5px;
`;

export const PaymentDetailsText = styled(Text)`
  width: 30%;
`;

export const AlignPaymentText = styled(Text)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
