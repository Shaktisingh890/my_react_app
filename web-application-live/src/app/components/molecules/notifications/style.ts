import { colorList } from "consts/color";
import styled from "styled-components";
import { Text } from "app/components/atoms/text";

interface IIsRead {
  isRead: boolean;
}

export const StyledCard = styled.div<IIsRead>`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  padding: 0.5rem 0.5rem;
  /* margin: 4px; */
  background: ${colorList.white1};
  box-shadow: 0px 1px 2px ${colorList.variant1};
  border-radius: 0.3125rem;
  margin: 0.4rem 0;
  cursor: pointer;
  background: ${({ isRead }) => (isRead ? "none" : `${colorList.variant22}`)};

  /* &:hover {
    cursor: pointer;
    box-shadow: 0 7px 14px rgba(100, 93, 238, 0.1);
  } */
`;

export const StyledContainer = styled.div`
  background: ${colorList.white1};
  display: flex;
  flex: 1;
  flex-direction: column;

  overflow: scroll;
`;

export const StyledText = styled(Text)`
  .show-underline {
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StyledCardChild1 = styled.div`
  flex: 1;
  /* display: flex; */
  flex-direction: row;
`;
export const StyledCardChild2 = styled(Text)`
  display: flex;
  justify-content: space-between;
  max-width: 10%;
`;

export const Divider = styled.div`
  margin-top: 0.5rem;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-left: 0.7rem;
  padding-right: 0.7rem;
  padding-bottom: 1rem;
`;
