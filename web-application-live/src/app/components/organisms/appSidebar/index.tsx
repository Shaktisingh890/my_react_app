import React, { ReactElement, useEffect, useState } from "react";
import {
  Divider,
  SidebarItem,
  SidebarMainItem,
  SidebarMenuItem,
  StyledContainer,
} from "./style";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { colorList } from "consts/color";
import { ChevronRight } from "@styled-icons/bootstrap/ChevronRight";
import { useHistory } from "react-router-dom";
import { privatePaths } from "consts/paths";
import { useTranslation } from "react-i18next";
import { getFromLocalStorage } from "localStorage";
import { translations } from "locales/translations";
import { ChevronDown, ChevronUp } from "@styled-icons/bootstrap";
import { getUserProfileDetailById } from "apiCalls/profile";
import Notify from "utils/notification";
import { getNotificationCountAtom } from "apiCalls/notification";
import { useAtom } from "jotai";

interface IRoute {
  name: string;
  key: string;
  path: string;
  children?: IRoute[];
}

export default function AppSidebar(): ReactElement {
  const history = useHistory();
  const { t } = useTranslation();

  const [notificationData, setNotificationData] = useAtom(getNotificationCountAtom);


  const notificationDots = (isVisible) => {
    const dotWidth = isVisible ? 6 : 0;
    return <div style={{ background: "red", width: `${dotWidth}px`, height: `${dotWidth}px`, borderRadius: "50%", marginRight: '4px' }}></div>

  }


  const sidebarRoutes = [
    {
      key: 'profile',
      name: t(translations.DASHBOARD.PROFILE),
      path: "",
      children: [
        {
          key: 'createProfile',
          name: t(translations.DASHBOARD.CREATE_PROFILE),
          path: privatePaths.brandProfile,
        },
        {
          key: 'viewProfile',
          name: t(translations.DASHBOARD.VIEW_PROFILE),
          path: privatePaths.dashboardProfile,
        },
      ],
    },
    {
      key: 'project',
      name: t(translations.DASHBOARD.PROJECT_BRIEFING),
      path: "",
      children: [
        {
          key: 'createProject',
          name: t(translations.DASHBOARD.CREATE_NEW_PROJECT),
          path: privatePaths.selectNewBrief,
        },
        {
          key: 'myProject',
          name: t(translations.DASHBOARD.MY_PROJECTS),
          path: privatePaths.dashboardBreifing,
        },
      ],
    },
    {
      key: 'marketplace',
      name: t(translations.DASHBOARD.MARKETPLACE),
      path: privatePaths.marketplace,
      children: [],
    },
    {
      key: 'chat',
      name: t(translations.DASHBOARD.DISCUSSION_ROOM),
      path: privatePaths.dashboardDiscussion,
      children: [],
    },
    {
      key: 'proposal',
      name: t(translations.DASHBOARD.PROPOSAL_MANAGEMENT),
      path: privatePaths.dashboardProposal,
      children: [],
    },
    {
      key: 'ask',
      name: t(translations.DASHBOARD.ASK_EXPANTER_EXPERT),
      path: privatePaths.talkToExpert,
      children: [],
    },
    {
      key: 'contact',
      name: t(translations.DASHBOARD.CONTACT_US),
      path: privatePaths.dashboardContactUs,
      children: [],
    },
  ];

  const highlightPaths = {
    profile: [0, 1],
    brand: [0, 2],
    serviceProvider: [0, 2],
    project_briefing: [1, 1],
    select_project_type: [1, 0],
    create: [1, 0],
    view_project: [-1, 1],
    search: [-1, 1],
    edit: [-1, 1],
    marketplace: [2],
    discussion_room: [3],
    chat: [3],
    proposal_management: [4],
    talk_to_expert: [5],
    contact_us: [6],
  };


  const [activeRoute, setActiveRoute] = useState<string>(sidebarRoutes[0].name);
  const [allRoutes, setAllRoutes] = useState<IRoute[]>();
  const [showDropdown, setShowDropdown] = useState<string[]>([]);
  const [isAdminApproved, setIsAdminApproved] = useState<boolean>(false);

  const handleActiveRouteNavigation = (item: IRoute) => {
    setNotificationData({ ...notificationData,['resetCount_'+item.key] : notificationData[item.key] , [item.key]: 0 ,  })
    history.push(item.path);
  };

  const handleShowDropdown = (item: IRoute) => {
    let list = [...showDropdown];
    list.push(item.name);
    setShowDropdown(list);
  };

  const adminApproval = async (id: any) => {
    try {
      const response = await getUserProfileDetailById(id);
      setIsAdminApproved(response.approvedByAdmin);

    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.PROJECT_DETAILS),
        message: error + "",
        type: "danger",
      });
    }

  };

  useEffect(() => {
    const pathString = location.pathname.split("/")[2];
    if (pathString && pathString.length > 1 && highlightPaths[pathString]) {
      const index1 = highlightPaths[pathString][0];
      const index2 = highlightPaths[pathString][1];

      if (index1 === -1) {
        if (location.pathname.split("/")[3] !== "projectBriefing") {
          setActiveRoute(sidebarRoutes[2].name);
        } else {
          handleShowDropdown(sidebarRoutes[1]);
          setActiveRoute(sidebarRoutes[1].children[index2]?.name);
        }
      } else if (index1 < 2) {
        handleShowDropdown(sidebarRoutes[index1]);
        setActiveRoute(sidebarRoutes[index1].children[index2].name);
      } else {
        setActiveRoute(sidebarRoutes[index1].name);
      }
    } else {
      setActiveRoute(sidebarRoutes[0].name);
    }
  }, [location.pathname]);

  useEffect(() => {
    const userRole = getFromLocalStorage("userRole");
    const userId = getFromLocalStorage("userId");
    adminApproval(userId)
    if (userRole === "serviceProvider") {
      let routes = sidebarRoutes.filter(
        (item) => {

          if (isAdminApproved) {
            return ![
              t(translations.DASHBOARD.PROJECT_BRIEFING),
              t(translations.DASHBOARD.ASK_EXPANTER_EXPERT),
            ].includes(item.name)
          } else {
            return [
              t(translations.DASHBOARD.CONTACT_US),
              t(translations.DASHBOARD.PROFILE),
            ].includes(item.name)
          }
        }
      );
      if (routes[0]?.children[0]?.path)
        routes[0].children[0].path = privatePaths.serviceProfile;

      setAllRoutes(routes);
    } else {
      let routes = sidebarRoutes.filter(
        (item) => {
          if (isAdminApproved) {
            return true;
          } else {
            return [
              t(translations.DASHBOARD.CONTACT_US),
              t(translations.DASHBOARD.PROFILE),
            ].includes(item.name)
          }
        });

      setAllRoutes(routes);
    }
  }, [isAdminApproved]);

  return (
    <StyledContainer>
      {allRoutes &&
        allRoutes.map((item, i) => (
          <div key={item.name + i}>
            {item.children && item.children?.length > 0 ? (
              <>
                <SidebarMainItem onClick={() => handleShowDropdown(item)}>


                  <Text
                    family={FontFamily.Inter}
                    size={FontSize.Small}
                    weight={FontWeight.Medium}
                    color={colorList.variant4}
                  >
                    {item.name}
                  </Text>

                  {showDropdown.includes(item.name) ? (
                    <ChevronUp color={colorList.white1} size={15} />
                  ) : (
                    <ChevronDown color={colorList.white1} size={15} />
                  )}
                </SidebarMainItem>
                {showDropdown.includes(item.name) && (
                  // <div className="row">
                  //   <div className="divider"></div>
                  <div className="column">
                    {item.children &&
                      item.children.map((el, j) => (
                        <div key={item.name + i + j} className="row">
                          <Divider active={activeRoute === el.name} />
                          <SidebarMenuItem
                            key={el.name}
                            onClick={() => handleActiveRouteNavigation(el)}
                            active={activeRoute === el.name}
                          >
                            <Text
                              family={FontFamily.Inter}
                              size={FontSize.ExtraSmall}
                              weight={FontWeight.Light}
                              color={
                                activeRoute === el.name
                                  ? colorList.white1
                                  : colorList.variant4
                              }
                            >
                              {el.name}
                            </Text>

                            {activeRoute === el.name && (
                              <ChevronRight
                                color={colorList.white1}
                                size={15}
                              />
                            )}
                          </SidebarMenuItem>
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <SidebarItem
                key={item.name}
                onClick={() => handleActiveRouteNavigation(item)}
                active={activeRoute === item.name}
              >


                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {notificationDots(notificationData[item.key])}
                  <Text
                    family={FontFamily.Inter}
                    size={FontSize.Small}
                    weight={FontWeight.Medium}
                    color={
                      activeRoute === item.name
                        ? colorList.white1
                        : colorList.variant4
                    }
                  >
                    {item.name}
                  </Text>

                </div>


                {activeRoute === item.name && (
                  <ChevronRight color={colorList.white1} size={15} />
                )}
              </SidebarItem>
            )}
          </div>
        ))}
    </StyledContainer>
  );
}
