import { atom, useAtom } from "jotai";
import { Api } from "network";
import { appNotifications } from "network/apiKeys";




export const getNotificationCountAtom = atom({});

// export function useNotification() {
//     const [notificationCountData, setNotificationData] = useAtom(getNotificationCount);

//     const setData = (data) => {
//         setNotificationData(data);
//     }

//     return [notificationCountData, setData]
// }


export const notificationCount = async () => {
    return await Api.get(appNotifications.notificationCount());
};

export const notificationAllRead = async () => {
    return await Api.put(appNotifications.notificationAllRead());
};

export const getAllNotifications = async (page, count) => {
    return await Api.get(appNotifications.getAllNotifications(), { page, count });
};

export const updateNotification = async (id: string, formFields: any) => {
    return await Api.put(appNotifications.updateNotification(id), formFields);
};

export const viewedNotification = async (formFields: any) => {
    return await Api.put(appNotifications.viewedNotification(), formFields)
};

