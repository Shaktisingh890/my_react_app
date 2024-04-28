import { Text } from "./../../../../components/atoms/text/index";
import styled from "styled-components";
import { colorList } from "consts/color";

interface IProps {
  smallWidth: boolean;
}

export const Container = styled.div`
  padding: 1.5rem;

  .row-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .column-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
  }

  .text-container {
    flex: 15%;
  }

  .flex-end-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    margin-top: 1.5rem;

    & > *:not(:last-child) {
      margin-right: 1rem;
    }
  }

  .divider1 {
    margin: 0.25rem 0;
  }

  .divider2 {
    margin: 1.5rem 0;
  }

  .iconImage {
    height: 1.2rem;
    width: 1.2rem;
    margin-left: 0.75rem;
  }

  .tag-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;

    & > *:not(:last-child) {
      display: block;
      margin-right: 0.75rem;
    }
  }
`;

export const AlignTitle = styled.div`
  display: flex;
  align-items: center;
`;
export const DividerLine = styled.div`
  border-top: 1px solid ${colorList.pink1};
  width: 100%;
  height: 0.1px;
  opacity: 0.2;
  flex: 85%;
`;

export const Tag = styled.div`
  background: ${colorList.variant3};
  border-radius: 5px;
  padding: 0.5rem 1rem;
  width: fit-content;
  margin-top: 0.5rem;

  & > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-right: 0.75rem;

  .column-container {
    flex: 50%;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem 0;

  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

export const StyledRadioContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem 0;

  & > *:not(:last-child) {
    margin-right: 1rem;
  }

  .radio-box {
    background-color: ${colorList.white1};
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem;
    max-width: 25rem;
    height: 4.875rem;
    width: 100%;

    .cursor {
      cursor: pointer;
    }

    .divider {
      margin-top: 0.3rem;
    }

    .bold {
      font-weight: 600;
    }
  }
`;
export const StyledText = styled(Text)`
  display: inline;
`;
export const StyledText1 = styled(Text)`
  display: inline;
  margin-left: 1rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex: 15%;
`;

export const StyledRadioLabel = styled.label<IProps>`
  margin-left: 0.75rem;
  width: ${({ smallWidth }) => (smallWidth ? "60%" : "90%")};
`;
