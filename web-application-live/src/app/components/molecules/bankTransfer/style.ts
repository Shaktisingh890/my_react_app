import { Text } from "app/components/atoms/text";
import styled from "styled-components";

export const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

export const StyledPartition = styled.div`
  width: 47%;
`;

export const AlignAtCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 2rem;
`;

export const StyledHeader = styled.div`
  min-width: 40%;
  display: flex;
  padding: 0 40px;
  justify-content: space-between;
  margin-left: 1%;
`;

export const Row = styled.div`
  display: flex;
`;

export const StyledTitleText = styled(Text)`
  text-align: center;
  b {
    font-weight: bold;
  }
`;

export const Divider = styled.div`
  margin-bottom: 0.7rem;
`;

export const Margin = styled.div`
  margin: 0.7rem 2rem; ;
`;
