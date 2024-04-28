import styled from "styled-components";
import { images } from "assets/images";
import { colorList } from "consts/color";

interface ISidebar {
  active: boolean;
}

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${images.sidebarBg});

  .divider {
    width: 1px;
    border-left: 1px solid ${colorList.variant20};
    background: pink;
    margin: 1rem 0;
    margin-left: 2rem;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .column {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

export const SidebarItem = styled.div<ISidebar>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: ${({ active }) => active && colorList.variant5};
`;

export const SidebarMainItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
`;

export const Divider = styled.div<ISidebar>`
  width: 1px;
  border-right: ${({ active }) =>
    active
      ? `3px solid ${colorList.variant21}`
      : `1px solid ${colorList.variant20}`};
  background-color: ${({ active }) => active && colorList.variant5};
  padding-left: ${({ active }) => (active ? `1.95rem` : `2rem`)};
`;

export const SidebarMenuItem = styled.div<ISidebar>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  padding-left: 1rem;
  width: 100%;
  background-color: ${({ active }) => active && colorList.variant5};
`;
