import styled from "styled-components";
import { colorList } from "consts/color";
import { Text } from "app/components/atoms/text";
import exports from "webpack";

export const PageContainer = styled.div`
  padding: 3rem;
  background-color: ${colorList.white6};
`;
export const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

export const StyledPartition = styled.div`
  width: 40%;
`;

export const StyledLabel = styled(Text)`
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`;

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

export const StyledRightChild = styled.div`
  width: 80%;
`;
export const StyledLogo = styled.img`
  height: 8.5rem;
  width: 8.5rem;
  background-color: white;
  border: 1px solid black;
  border-radius: 50%;
  object-fit: contain;
`;

export const StyledContainer = styled.div`
  display: flex;
  height: calc(100% - 4rem);
  width: 100%;
  overflow: auto;
`;

export const StyledChildLeft = styled.div`
  flex: 15%;
`;

export const StyledDivider = styled.div`
  background: ${colorList.blue3};
  height: 1px;
  width: 100%;
  margin: 3rem 0;
`;
export const Divider = styled.div`
  margin: 1rem 0;
`;

export const StyledContact = styled(Text)`
  margin-top: 2.3rem;
  margin-bottom: 0.5rem;
`;

export const StyledPerson = styled(Text)`
  margin-top: 2.3rem;
  margin-left: 0.5rem;
`;
export const StyledFlex = styled.div`
  display: flex;
`;

export const StyledAdminApprovedProgressText = styled.p`
  background: ${colorList.yellow};
  padding: 0.5rem;
  margin: 0;
`;
