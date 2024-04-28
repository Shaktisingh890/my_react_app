import styled from "styled-components";
import { colorList } from "consts/color";
import { Button } from "app/components/atoms/mybutton";

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

    .marketPlaceCards {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;

      & > * {
        margin: 0.5rem;
        flex: 48%;
        max-width: 48%;
      }
    }
  }

  .divider {
    margin-top: 2rem;
  }
`;

export const StyledCard = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;

  background: ${colorList.white1};
  box-shadow: 0px 1px 2px ${colorList.variant1};
  border-radius: 0.3125rem;
  margin: 0.75rem 0;

  .first-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1.125rem 1.5rem;

    .divider {
      margin-top: 0.375rem;
    }
  }

  .pink-divider {
    border-bottom: 1px solid ${colorList.variant9};
  }

  .briefType {
    padding: 1rem 1.5rem 0;
  }

  .label-container {
    flex-wrap: wrap;
    display: flex;
    flex-direction: row;
    padding-left: 1.8rem;
    padding-right: 0.3rem;
    margin: 0.5rem 0;

    .tag {
      background: ${colorList.white8};
      border-radius: 5px;
      padding: 0.25rem 0.5rem;
      margin-right: 0.3rem;
      margin-bottom: 0.3rem;
      text-transform: capitalize;
    }
  }

  .space {
    padding-left: 3.5rem;
  }

  .second-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1.5rem 0;

    .left-divider {
      margin-left: 1.5rem;
    }

    .top-divider {
      margin-top: 1rem;
    }

    .right-divider {
      margin-right: 0.7rem;
    }

    .logo {
      margin-right: 0.5rem;
    }

    .cursor {
      cursor: pointer;
    }

    .divider {
      margin-top: 0.375rem;
    }

    .container {
      display: flex;
      flex-direction: column;
    }

    .rowContainer {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .columnContainer {
      display: flex;
      flex-direction: column;
    }

    .row-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
  }
`;

export const ViewButton = styled.button`
  background-color: ${colorList.blue1};
  outline: none;
  border: none;
  cursor: pointer;
  padding: 0.625rem 1.5rem;
  border-radius: 5px;
`;

export const ShowProposalsButton = styled.button`
  background-color: ${colorList.white1};

  border: 1px solid ${colorList.grey1};
  cursor: pointer;
  padding: 0.625rem 1.5rem;
  border-radius: 5px;
`;

export const PopupContainer = styled.div`
  background-color: ${colorList.white1};
  box-shadow: 0px 1px 2px ${colorList.variant1};
  padding: 1rem;
  border: 1px solid ${colorList.white4};
  border-radius: 5px;
  overflow: hidden;
`;

export const UserLogo = styled.img`
  width: 3rem;
  height: 3rem;
  background-color: white;
  border-radius: 50%;
  object-fit: contain;
  border: 1px solid ${colorList.grey4};
`;
