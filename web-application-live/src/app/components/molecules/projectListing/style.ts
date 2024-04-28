import styled from "styled-components";
import { colorList } from "consts/color";
import { Button } from "app/components/atoms/mybutton";
import { Text } from "app/components/atoms/text";

interface ITitle {
  onClick: Function;
}

export const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: 1.125rem 1.5rem;
  margin: 4px;
  background: ${colorList.white1};
  box-shadow: 0px 1px 2px ${colorList.variant1};
  border-radius: 0.3125rem;
  margin: 0.75rem 0;
  .first-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    width: 82%;
    .divider {
      margin-top: 0.375rem;
    }
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0 14px 28px rgba(100, 93, 238, 0.1);
  }
`;

export const StyledContainer = styled.div`
  margin-left: 2rem;
  margin-right: 2rem;

  .center {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    padding-top: 2rem;
    border-top: 1px solid ${colorList.variant2};
  }

  .list {
    margin: 0 0.5rem;
  }
`;

export const StyledTitle = styled.div`
  cursor: pointer;
`;

export const ToggleDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledCardContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
