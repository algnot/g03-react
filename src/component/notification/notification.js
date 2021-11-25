import React , {useEffect,useState} from 'react'
import { auth, firestore } from '../../firebase/firebase'
import style from './notification.module.css'
import { Helmet } from 'react-helmet'

export default function Notification() {

    const [time, setTime] = useState('')
    const [message, setMessage] = useState('')
    const [link, setLink] = useState('')
    const [img, setImg] = useState('')

    const [display, setDisplay] = useState(false)
    const [title, setTitle] = useState('G03 - project')

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user){
                const notificationRef = firestore.collection('users').doc(user.uid)
                                                 .collection('notification').doc('isShow')
                notificationRef.onSnapshot(doc => {
                    if(doc.exists) {
                        if(doc.data().read){
                            setDisplay(false)
                            return;
                        } 
                        setDisplay(true)
                        setTime(doc.data().time)
                        setMessage(doc.data().message)
                        setLink(doc.data().link)
                        setImg(doc.data().img)
                        setTitle(`G03 - ${doc.data().message}`)
                        setTimeout(() => {
                            setDisplay(false)
                            notificationRef.update({
                                read : true
                            })
                            setTitle('G03 - project')
                        },5000)
                    }
                })
            }
        })
    }, [])

    const convertTime = (time) => {
        var sec = Math.floor(new Date().valueOf() - time) / 1000
        var min = Math.floor(sec/60)
        var hour = Math.floor(min/60)
        var day = Math.floor(hour/24)
    
        var date = new Date(time).getDate()
        var month_name = ["January","February","March","April","May","June","July","August","September","October","November","Decemter"]
        var monthD = new Date(time).getMonth()
        var year = new Date(time).getFullYear()
    
        if(sec < 60) {
          return `${parseInt(sec)} seconds ago`
        }
        else if(min < 60) {
          return `${parseInt(min)} minutes ago`
        }
        else if(hour < 24){
          return `${parseInt(hour)} hours ago`
        }
        else if(day < 3){
          return `${parseInt(day)} days ago`
        }
        else {
          return `${date} ${month_name[monthD]} ${year}`
        }
    }

    return (
        <>
        <Helmet>
          <title>{ title }</title>
        </Helmet>
        {
            display && (
                <div className={style.container}
                     onClick={() => window.location.href=link}>
                    <div className={style.imgContainer}>
                        <div className={style.userProfile} style={{backgroundImage:`url(${img})`}}></div>
                    </div>
                    <div className={style.textNotification}>
                        <div className={style.Head}>{message}</div>
                        <div className={style.Time}>{convertTime(time)}</div>
                    </div>
                </div>        
            )
        }
        </>
    )
}



