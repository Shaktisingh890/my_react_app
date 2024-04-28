import styled from "styled-components";
import { colorList } from "consts/color";

export const StyledCard = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 0.75rem;

  .first-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    width: 65%;
    .divider {
      margin-top: 0.5rem;
    }
  }
`;

export const StyledContainer = styled.div`
  width: 100%;
  margin-right: 1rem;

  .center {
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: 1rem;
    margin-right: 1.5rem;
    padding-top: 2rem;
    border-top: 1px solid ${colorList.variant2};
  }
`;

export const StyledCardContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 0.3125rem;
  background: ${colorList.white1};
  width: 48%;
  min-height: 180px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0px 1px 2px ${colorList.variant1};
`;
export const ViewButton = styled.button`
  background-color: ${colorList.blue1};
  outline: none;
  border: none;
  cursor: pointer;
  padding: 0.8rem 2rem;
  border-radius: 5px;
  margin-right: 1rem;
  margin-top: 0.3rem;
`;

export const ProposelButton = styled.button`
  background-color: ${colorList.white1};
  outline: none;
  border: 2px solid ${colorList.grey4};
  cursor: pointer;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  margin-right: 1rem;
  margin-top: 0.3rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 33%;
  margin-left: 0.8rem;
`;

export const StyledContainer1 = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
export const Divider = styled.div`
  margin-top: 1.4rem;
`;
export const Margin = styled.div`
  margin-top: 0.4rem;
`;

export const MarginBottom = styled.div`
  margin-bottom: 0.5rem;
`;
