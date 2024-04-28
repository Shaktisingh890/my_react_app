import styled from "styled-components";
import { colorList } from "consts/color";
import { Text } from "app/components/atoms/text";

export const PageContainer = styled.div`
  padding: 5% 25%;

  background-color: ${colorList.white6};
`;

export const StyledDropdown = styled.div`
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
`;
export const StyledDivider = styled.div`
  margin-bottom: 1rem;
`;

export const StyledText = styled(Text)`
  padding-bottom: 2rem;
`;

export const Thanks = styled.div`
  margin-top: 40%;
  margin-bottom: 40%;
`;
