import React, { useEffect, useCallback } from 'react';

export default function Notification({ notifications, setNotifications }) {
    const removeFirstNotification = useCallback(index => {
        let newNotifications = [...notifications];
        newNotifications = newNotifications.filter(notification => notification.id !== index);
        setNotifications(newNotifications);
    }, [notifications, setNotifications]);

    useEffect(() => {
        const intervalNotification = setInterval(() => {
            if(notifications.length) {
                removeFirstNotification([0].index);
            }
        }, 3292);

        return () => {
            clearInterval(intervalNotification);
        }
    }, [notifications, removeFirstNotification]);

    return (
        <>
            {notifications.map((notification, index) => ( 
                <div key={'notification' + index}>
                    {notifications[index].type === 'default' ? (
                        <div className='notification default' style={{ marginTop: (notifications[index].index * 3.24).toString() + 'rem' }}><i className="fa-solid fa-circle-info"></i> {notifications[index].message}</div>
                    ) : (<></>)}
                    {notifications[index].type === 'error' ? (
                        <div className='notification error' style={{ marginTop: (notifications[index].index * 3.24).toString() + 'rem' }}><i className="fa-solid fa-triangle-exclamation"></i> {notifications[index].message}</div>
                    ) : (<></>)}
                    {notifications[index].type === 'success' ? (
                        <div className='notification success' style={{ marginTop: (notifications[index].index * 3.24).toString() + 'rem' }}><i className="fa-solid fa-square-check"></i> {notifications[index].message}</div>
                    ) : (<></>)}
                </div>
            ))}
        </>
    )
}