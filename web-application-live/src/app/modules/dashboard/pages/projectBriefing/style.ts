import styled from "styled-components";
import { colorList } from "consts/color";

export const StyledContainer = styled.div`
  padding: 1.5rem;

  .row-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .column-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .divider {
    margin-top: 2rem;
  }
`;

export const StyledCard = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.125rem 1.5rem;
  background: ${colorList.white1};
  box-shadow: 0px 1px 2px ${colorList.variant1};
  border-radius: 0.3125rem;
  margin: 0.75rem 0;

  .first-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 60%;

    .divider {
      margin-top: 0.375rem;
    }
  }

  .second-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 40%;

    .left-divider {
      margin-left: 1.5rem;
    }

    .cursor {
      cursor: pointer;
    }
  }
`;

export const PopupContainer = styled.div`
  background-color: ${colorList.white1};
  box-shadow: 0px 1px 2px ${colorList.variant1};
  padding: 1rem;
  border: 1px solid ${colorList.white4};
  border-radius: 5px;
  overflow: hidden;
`;
