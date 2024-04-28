import { FontFamily, FontSize, FontWeight, Text } from "app/components/atoms/text";
import { translations } from "locales/translations";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { colorList } from "consts/color";
import {
    StyledCard,
    StyledCardChild1,
    StyledText,
    StyledCardChild2,
    HeaderContainer,
    StyledContainer,
    Divider
} from "./style";
import { ChevronRight } from "@styled-icons/bootstrap";
import { getAllNotifications, notificationAllRead, updateNotification, viewedNotification } from "apiCalls/notification";
import Notify from "utils/notification";
import ReactTooltip from "react-tooltip";
import { timeSince } from "utils/dateTimeFormat";
import { generatePath, useHistory } from "react-router-dom";
import { privatePaths } from "consts/paths";


const PAGE_COUNT = 20;


export default function Notifications({ closePopup }) {

    const history = useHistory();
    const { t } = useTranslation();
    const [receivedNotifications, setReceivedNotifications] = useState<any>([]);
    const [markAsRead, setMarkAsRead] = useState<any>("");
    const [page, setPage] = useState<number>(0);

    const [viewNotification, setViewNotification] = useState<any>("");


    const getReceivedNotifications = async () => {
        try {
            const response = await getAllNotifications(page, PAGE_COUNT);

            setReceivedNotifications(notifications => [...notifications, ...response].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
            if (response.length === PAGE_COUNT) {
                setPage(page => page + 1)
            }
        } catch (error) {
            Notify({
                title: "",
                message: error + "",
                type: "danger",
            });

        }
    };

    const markAllRead = async () => {
        try {
            const response = await notificationAllRead();
            setMarkAsRead(response);
        } catch (error) {
            Notify({
                title: "",
                message: error + "",
                type: "danger",
            });

        }
    };
    const notificationViewed = async (id: string) => {

        try {
            const response = await updateNotification(id, { isRead: true });
            setViewNotification(response);
        } catch (error) {
            Notify({
                title: "",
                message: error + "",
                type: "danger",
            });

        }

    };


    const navigateTo = (item: any) => {
        return () => {
            notificationViewed(item?._id);
            const { screen, extraData } = item;
            switch (screen) {
                case 'PROPOSAL_MANAGEMENT':
                    history.push(privatePaths.dashboardProposal);
                    break;
                case 'CHAT':
                    history.push(privatePaths.dashboardDiscussion);
                    break;
                case 'PROJECT_DETAIL':
                    history.push(
                        generatePath(privatePaths.dashboardDiscussion, {
                            id: extraData.proposal,
                        })
                    );
                    break;
                case 'PAYMENTS':
                    history.push(
                        generatePath(privatePaths.payments, {
                            id: extraData.proposal,
                        })
                    );
                    break;
                case 'PROFILE':
                    history.push(privatePaths.dashboardProfile);
                    break;
                default:
            }
            closePopup();
        }



    }



    useEffect(() => {
        getReceivedNotifications()
    }, [page]);

    return <StyledContainer>
        <HeaderContainer>
            <Text
                weight={FontWeight.Bold}
                family={FontFamily.Inter}
                size={FontSize.Regular}
            >
                {t(translations.BRAND.NOTIFICATIONS)}
            </Text>
            <div onClick={markAllRead}>
                <StyledText
                    weight={FontWeight.Medium}
                    family={FontFamily.Inter}
                    size={FontSize.Regular}
                >
                    <>
                        <a className="show-underline" data-tip={t(translations.BRAND.MARK_ALL_AS_READ)}> {t(translations.BRAND.MARK_ALL_AS_READ)}</a>
                        <ReactTooltip place="top" type="dark" effect="float" />
                    </>
                </StyledText>
            </div>

        </HeaderContainer>
        <div>
            {receivedNotifications && receivedNotifications?.map((item, index) =>
                <StyledCard isRead={item.isRead} onClick={navigateTo(item)} key={index}>
                    <StyledCardChild1>
                        <Text
                            family={FontFamily.Inter}
                            size={FontSize.ExtraSmall}
                            weight={FontWeight.Medium}
                            color={colorList.blue1}
                        >
                            {item?.message}
                        </Text>
                        <Divider />
                        <Text
                            family={FontFamily.Inter}
                            size={FontSize.Mini}
                            weight={FontWeight.Regular}
                            color={colorList.grey3}
                        >
                            {timeSince(item?.createdAt)}
                        </Text>
                    </StyledCardChild1>
                    <StyledCardChild2
                        family={FontFamily.Inter}
                        size={FontSize.Mini}
                        weight={FontWeight.Regular}
                        color={colorList.grey3}
                    >

                        {<ChevronRight
                            style={{ marginLeft: "1.5rem" }}
                            size={20}
                            color={colorList.blue1}
                            className="weight"
                        />}
                    </StyledCardChild2>
                </StyledCard>
            )}

        </div>
    </StyledContainer >
}