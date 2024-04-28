import styled from "styled-components";
import { colorList } from "consts/color";
import { images } from "assets/images";

interface IDivider {
  height: number;
}

export const PageContainer = styled.div`
  margin-bottom: 4rem;

  .row-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1.375rem;
  }

  .center {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
`;

export const DividerLine = styled.div`
  border-top: 1px solid ${colorList.pink1};
  width: 85%;
  height: 0.1px;
  opacity: 0.2;
  margin: 0 1.5rem;
`;

export const LargeDividerLine = styled.div`
  border-top: 1px solid ${colorList.blue1};
  width: 100%;
  height: 0.1px;
  opacity: 0.2;
`;

export const DropdownContainer = styled.div`
  padding: 1.375rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;

  & > div {
    flex: 20%;
    margin: 0.5rem 1rem;
  }
`;

export const SPCard = styled.div`
  background: ${colorList.white1};
  box-shadow: 0px 1px 2px ${colorList.variant2};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  margin: 1.375rem;
  overflow: hidden;

  .logo-container {
    background-color: ${colorList.white1};
    border-radius: 50%;
    padding: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .first-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(${images.purpleBg});

    padding: 2rem 1rem;

    .logo {
      margin-left: 0.5rem;
      margin-bottom: -5rem;
    }

    .buttons {
      & > button {
        margin-left: 1rem;
      }
    }
  }

  .second-row {
    padding: 2.5rem 1.5rem;

    .row {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    .flex-3 {
      align-items: flex-start;

      & > * {
        flex: 33%;
      }
    }

    .flex-4 {
      align-items: flex-start;

      & > * {
        flex: 25%;
      }
    }

    .label-container {
      margin: 1rem 0;

      .tag {
        background: ${colorList.white8};
        border-radius: 5px;
        padding: 0.25rem 0.5rem;
        margin-right: 0.3rem;
        margin-bottom: 0.3rem;
        text-transform: capitalize;
        width: fit-content;
      }

      .column {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
      }
    }
  }
`;

export const UserLogo = styled.img`
  width: 5.5rem;
  height: 5.5rem;
  background-color: white;
  border-radius: 50%;
  object-fit: contain;
  border: 1px solid ${colorList.grey4};
`;

export const Divider = styled.div<IDivider>`
  width: 100%;
  height: ${({ height }) => height + "rem"};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  .purpleContainer {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(${images.purpleBg});

    display: flex;
    justify-content:space-between ;
    flex-direction: row;
    padding: 1rem;
    padding-left: 3rem;

    .crossIcon {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;

      .cursor {
        cursor: pointer;
      }
    }

    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .column {
      display: flex;
      flex-direction: column;
    }

    .spacing {
      margin-left: 1rem;
    }
  }

  .whiteContainer {
    background-color: ${colorList.white1};
    padding: 2.5rem;
    padding-left: 3rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-height: 70vh;

    overflow: auto;
    height: 100%;

    .firstChild {
      flex: 40%;
      max-width: 37%;
      height: 100%;

      & > div {
        margin-bottom: 1.5rem;
      }
    }

    .secondChild {
      flex: 60%;
      max-width: 60%;
      height: 100%;
      padding-left: 2.5rem;
      border-left: 1px solid ${colorList.variant2};

      & > div {
        margin-bottom: 1.5rem;
      }
    }
  }

  .label-container {
    .tag {
      background: ${colorList.white8};
      border-radius: 5px;
      padding: 0.25rem 0.5rem;
      margin: 0.3rem;
      width: fit-content;
    }

    .row {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
    }
  }

  .loader {
    height: 70vh;
  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    border-top: 1px solid ${colorList.variant2};

    & > * {
      margin-right: 1rem;
    }
  }

  .logo-container {
    background-color: ${colorList.white1};
    border-radius: 50%;
    padding: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
