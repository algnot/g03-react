import { firestore } from "./firebase/firebase";

const sendNotification = (uid , message , time , img ,link) => {
    const notificationShowRef = firestore.collection('users').doc(uid)
                                     .collection('notification').doc('isShow')

    const notificationRef = firestore.collection('users').doc(uid)
                                     .collection('notification')
    notificationShowRef.set({
        uid : uid,
        message : message,
        time : time,
        link : link,
        img : img,
        read : false,
        show : false
    })
    notificationRef.add({
        uid : uid,
        message : message,
        time : time,
        link : link,
        img : img,
        show : true
    })
}

export default sendNotification;