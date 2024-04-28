import styled from "styled-components";
import { colorList } from "consts/color";
import { images } from "assets/images";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4rem;
  background-color: ${colorList.white1};
  padding: 0.75rem 1.25rem;

  .button-container {
    display: flex;
    flex-direction: row;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;

    & > *:not(:last-child) {
      margin-right: 1rem;
    }
  }
`;
export const ArrowDown = styled.div`
  width: 0;
  height: 0;
  position: absolute;
  margin-top: 3rem;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  box-shadow: 0px 1px 2px ${colorList.variant1};
  border-bottom: 10px solid ${colorList.white4};
`;

export const StyledLogo = styled.div`
  width: 12rem;
  height: 2rem;
  background: url(${images.expanterPurpleLogo});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`;

export const StyledXLogo = styled.img`
  width: 2rem;
  height: 2rem;
  background: url(${images.xPurple});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 0.625rem;
`;

export const LogoContainer = styled.div`
  background: ${colorList.white5};
  border-radius: 50%;
  padding: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0.5rem;

  .divider {
    margin-bottom: 0.7rem;
  }
`;

export const BellContainer = styled.div`
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NotificationsContainer = styled.div`
  padding-top: 1rem;
  overflow: scroll;
  height: 40rem;
`;

export const LogoutButton = styled.button`
  border: none;
  box-shadow: 1px 1px 5px ${colorList.grey4};
  background: transparent;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin-top: 1rem;
  color: ${colorList.blue1};
`;

export const UserSmallLogo = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: contain;
  border: 1px solid ${colorList.grey4};
  background-color: white;
`;

export const UserLargeLogo = styled.img`
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  object-fit: contain;
  border: 1px solid ${colorList.grey4};
  background-color: white;
`;

export const StyledNotifications = styled.div`
  background: red;
  padding-left: 4px;
  padding-right: 4px;
  border-radius: 50%;
  font-size: 0.8rem;
  color: white;
  margin-left: 1rem;
  margin-bottom: 1.5rem;
  position: absolute;
`;
