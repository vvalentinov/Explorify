import { baseUrl } from '../constants/baseUrl';
import { requestFactory } from '../lib/requester';

export const notificationsServiceFactory = (token) => {

    const request = requestFactory(token);

    return {
        getNotifications: (page) => request.get(`${baseUrl}/Notification/GetNotifications?page=${page}`),
        getUnreadNotificationsCount: () => request.get(`${baseUrl}/Notification/GetUnreadNotificationsCount`),
        markNotificationAsRead: (notifId) => request.put(`${baseUrl}/Notification/MarkNotificationAsRead?notificationId=${notifId}`),
        delete: (notifId) => request.delete(`${baseUrl}/Notification/Delete?notificationId=${notifId}`)
    }
};