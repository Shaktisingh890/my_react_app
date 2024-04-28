import styled from "styled-components";
import { colorList } from "consts/color";
import { Text } from "app/components/atoms/text";

export const StyledCard = styled.div`
  display: flex;
  padding: 2rem;
  background: #ffffff;
  box-shadow: 0px 1px 2px rgba(71, 105, 249, 0.2);
  margin-bottom: 4px;
`;
export const StyledViewButton = styled.button`
  outline: none;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: ${colorList.blue1};
  padding: 0.8rem 1.5rem;
`;

export const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  padding: 1.7rem;
  background: #ffffff;
  box-shadow: 0px 1px 2px rgba(71, 105, 249, 0.2);
  margin-bottom: 4px;
`;

export const StyledChild1 = styled.div`
  border-right: 1px solid ${colorList.variant23};
  width: 37%;
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  align-items: center;
  text-align: center;
`;

export const StyledChild2 = styled.div`
  border-right: 1px solid ${colorList.variant23};
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const StyledText1 = styled(Text)`
  display: inline;
  margin-left: 1rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex: 15%;
`;

export const AlignTitle = styled.div`
  display: flex;
  align-items: center;
`;

export const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const Divider = styled.div`
  margin-top: 0.7rem;
`;

export const PayButton = styled.button`
  outline: none;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  width: 100%;
  background-color: ${colorList.blue1};
  padding: 0.6rem 0.7rem;
`;

export const StyledButton = styled.button`
  background-color: ${colorList.white1};
  outline: none;
  border: 2px solid ${colorList.grey4};
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  width: 100%;
  text-align: center;
  margin-top: 0.4rem;

  /* margin-top: 0.3rem; */
`;

export const ButtonContainer = styled.div`
  /* margin-top: 1rem; */
  display: flex;
  flex-direction: column;
  margin-right: 0.2rem;
  align-items: center;

  /* width: 33%; */
  margin-left: 0.2rem;
`;

export const NoData = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;
