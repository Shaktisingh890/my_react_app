import styled from "styled-components";
import { colorList } from "consts/color";
import { images } from "assets/images";
import { Text } from "app/components/atoms/text";

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;

  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: ${colorList.white6};
  padding: 1.5rem;

  .spacing {
    margin-left: 0.5rem;
    cursor: pointer;
  }

  .form-container {
    & > *:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }

  .checkbox-container {
    background-color: ${colorList.variant3};
    border-radius: 0.3125rem;
    width: fit-content;
    padding: 0.25rem 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & > *:not(:last-child) {
      margin-right: 2rem;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledLogo = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 0.625rem;
  background: url(${images.expanterIcon});
`;

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > *:not(:last-child) {
    display: block;
    margin-right: 1.5rem;
  }
`;
export const Footer = styled.div`
  text-align: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
  height: 18.75rem;
  margin-top: 2.5rem;
  width: 100%;
  padding-top: 1.25rem;
  padding-bottom: 12.5rem;
`;
