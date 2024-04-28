import styled from "styled-components";
import { colorList } from "consts/color";

interface IDivider {
  height: number;
}

export const StyledContainer = styled.div`
  padding: 1.5rem;

  .weight {
    font-weight: 600;
  }

  .cursor {
    cursor: pointer;
  }

  .subtitle {
    &:hover {
      text-decoration: underline;
    }
  }

  .center {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    padding-top: 2rem;
    border-top: 1px solid ${colorList.variant2};
  }

  .logo-container {
    background-color: white;
    border-radius: 50%;
    padding: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5.5rem;
    height: 5.5rem;
  }

  .border-divider {
    border-top: 1px solid ${colorList.variant2};
  }

  .tag {
    background: ${colorList.variant3};
    border-radius: 0.3125rem;
    padding: 0.3125rem 1rem;
    width: fit-content;
    text-transform: capitalize;
  }

  .chat-card {
    background: ${colorList.white1};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid ${colorList.variant2};
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1.5rem;
  }

  .row-start {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .column {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;

    & > *:not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  .arrow-logo {
    background: ${colorList.variant8};
    border: 1px solid ${colorList.variant2};
    box-sizing: border-box;
    border-radius: 5px;
    padding: 0.625rem 1.5rem;
    cursor: pointer;
  }

  .activeChat {
    background-color: ${colorList.grey5};
    border: 1px solid ${colorList.blue1};
  }

  .listContainer {
    display: flex;
    flex-direction: row;
    margin-top: 1.5rem;
    margin-left: 0.5rem;

    .chatList {
      height: 75.7vh;
      overflow: auto;
    }

    & > div {
      flex: 50%;
    }
  }

  .ellipsis-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    @supports (-webkit-line-clamp: 2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
`;

export const UserLogo = styled.img`
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  background-color: white;
  border: 1px solid ${colorList.grey4};
  object-fit: contain;
`;

export const Divider = styled.div<IDivider>`
  width: 100%;
  height: ${({ height }) => height + "rem"};
`;

export const StyledDivider = styled.div`
  &:hover {
    text-decoration: underline;
    background: ${colorList.blue3};
    height: 1px;
    width: 5.125rem;
  }
`;
