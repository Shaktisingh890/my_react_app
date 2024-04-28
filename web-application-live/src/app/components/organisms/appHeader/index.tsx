import React, { ReactElement, useEffect, useState, useCallback } from "react";
import {
  LogoContainer,
  LogoutButton,
  PopupContainer,
  StyledContainer,
  StyledLogo,
  StyledXLogo,
  UserLargeLogo,
  UserSmallLogo,
  StyledNotifications,
  ArrowDown,
  NotificationsContainer,
  BellContainer
} from "./style";
import {
  Bell
} from "@styled-icons/bootstrap";
import { Person } from "@styled-icons/bootstrap/Person";
import { colorList } from "consts/color";
import { publicPaths } from "consts/paths";
import { useHistory } from "react-router-dom";
import PopUp from "app/components/atoms/popup";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import { getFromLocalStorage, setInLocalStorage } from "localStorage";
import { getUserProfileDetail } from "apiCalls/profile";
import { use } from "i18next";
import { getNotificationCountAtom, notificationCount } from "apiCalls/notification";
import Notifications from "app/components/molecules/notifications";
import Notify from "utils/notification";
import { useAtom } from "jotai";

interface IUserInfo {
  name: string;
  email: string;
  logo: string;
}

export default function AppHeader(): ReactElement {
  const [displayPopup, setDisplayPopup] = useState<boolean>(false);
  const [displayNotificationPopup, setDisplayNotificationPopup] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [showArrow, setShowArrow] = useState<boolean>(false);
  const [notificationNumber, setNotificationNumber] = useState<any>("");
  const [notificationData, setNotificationData] = useAtom(getNotificationCountAtom);

  const history = useHistory();
  const { t } = useTranslation();

  const handleLogout = () => {
    history.push(publicPaths.login);
    return setInLocalStorage("accessToken", "")

  };

  const handlePopupDisplay = () => {
    setDisplayPopup(!displayPopup);
  };

  const handleNotificationPopupDisplay = () => {
    // setDisplayNotificationPopup(!displayNotificationPopup)
    getNotificationCount();

  }

  useEffect(() => {
    const role = getFromLocalStorage("userRole");

    getUserProfileDetail(role)
      .then((resp: any) => {
        setUserInfo({
          name: resp.businessName,
          email: resp.email,
          logo: resp?.logo?.thumbnail,
        });
      })
      .catch(() => {
        setUserInfo({
          name: "",
          email: "",
          logo: "",
        });
      });
  }, []);


  useEffect(() => { }, [])

  const showLogo = (size: number) => {
    if (userInfo?.logo) {
      if (size === 20) return <UserSmallLogo src={userInfo.logo} />;
      else return <UserLargeLogo src={userInfo.logo} />;
    } else
      return (
        <LogoContainer>
          <Person color={colorList.blue1} size={size} />
        </LogoContainer>
      );
  };
  const bellClick = () => {
    setShowArrow(!showArrow)
  }

  const updateNotificationCount = (response) => {

    let copy = { ...response };

    Object.keys(response).forEach((key) => {
      copy[key] = notificationData['resetCount_' + key] && copy[key] != 0 ? copy[key] - notificationData['resetCount_' + key] : copy[key]
      if (copy[key] === 0) {
        copy['resetCount_' + key] = 0
      }
    })


    setNotificationData({ ...notificationData, ...copy });
  }

  const getNotificationCount = async () => {
    try {
      const response = await notificationCount();

      updateNotificationCount(response);
      const count = response.total;
      if (count <= 0) {
        setNotificationNumber(count)
      }
      if (count > 0 && count <= 99) {
        setNotificationNumber(count)
      }
      if (count > 99) {
        setNotificationNumber(count + "+")
      }

      setNotificationNumber(response.total)

    } catch (error) {
      // Notify({
      //   title: "",
      //   message: error + "",
      //   type: "danger",
      // });

    }
  };

  useEffect(() => {

    const id = setInterval(() => {
      getNotificationCount();
    }, 10000)
    getNotificationCount();

    return () => {
      clearInterval(id);
    }

  }, []);

  const renderBellIcon = (open) => <BellContainer >{
    <Bell onClick={bellClick}
      height={"23px"}
      width={"23px"}
      fill={colorList.blue1}
    />}
    {
      notificationNumber > 0 &&

      <StyledNotifications>
        {notificationNumber}
      </StyledNotifications>

    }
    {open && <ArrowDown />}

  </BellContainer>

  // const closePopupFromInside = useCallback(
  //   () => {
  //     setDisplayNotificationPopup(d => false);
  //     // handleNotificationPopupDisplay();
  //   },
  //   [setDisplayNotificationPopup],
  // )

  const closePopupFromInside = () => {
    setDisplayNotificationPopup(d => false);
  }

  return (
    <StyledContainer>
      <div className="row">
        <StyledXLogo />
        <StyledLogo />
      </div>
      <div className="row">
        <PopUp
          style={{
            width: '35rem',
            maxHeight: '40rem'
          }}
          onClose={handleNotificationPopupDisplay}
          position="bottom right"
          trigger={open => renderBellIcon(open)}
        >
          {close => (
            <NotificationsContainer>
              <Notifications closePopup={close} />
            </NotificationsContainer>
          )}
        </PopUp>

        <Text
          family={FontFamily.Inter}
          size={FontSize.Mini}
          weight={FontWeight.Bold}
        >
          {t(translations.GENERIC.HI)} {userInfo?.name}
        </Text>
        <PopUp
          position="bottom right"
          trigger={<div onClick={handlePopupDisplay}>{showLogo(20)}</div>}
        >
          {!displayPopup && (
            <PopupContainer>
              {showLogo(50)}
              <div className="divider" />
              <Text family={FontFamily.Inter} weight={FontWeight.SemiBold}>
                {t(translations.GENERIC.HELLO)}
              </Text>
              <div className="divider" />
              <Text
                family={FontFamily.Inter}
                size={FontSize.Small}
                weight={FontWeight.Medium}
              >
                {userInfo?.name?.toUpperCase()}
              </Text>
              <Text
                family={FontFamily.Inter}
                weight={FontWeight.Light}
                size={FontSize.Mini}
              >
                {userInfo?.email}
              </Text>
              <LogoutButton onClick={handleLogout}>
                {t(translations.BUTTONS.LOG_OUT)}
              </LogoutButton>
            </PopupContainer>
          )}
        </PopUp>
      </div>
    </StyledContainer >
  );
}
