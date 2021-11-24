import React , {useEffect,useState} from 'react'
import Navbar from '../../component/navbar/navbar'
import Search from '../../component/search/search'
import { auth, firestore } from '../../firebase/firebase'
import style from './notification.module.css'

export default function Notification() {

  const [notification, setNotification] = useState([])

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) {
        firestore.collection('users').doc(user.uid)
                 .collection('notification').where('show' , '==' , true)
        .onSnapshot(docs => {
          var temp = []
          docs.forEach(doc => {
            temp = [...temp , doc.data()]
          })
          setNotification(temp)
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
    <div>
      <Navbar />
      <div className="content">
        <div className={style.container}>
          <div className={style.topNav}>
            <div className={style.textTopNav} >
              Notification
            </div>
          </div>
          <div style={{marginTop:59}}></div>
          {
            notification.map((item,index) => {
              return (
                <div key={index} className={style.notiBox}
                     onClick={() => window.location.href=item.link}>
                  <div className={style.img}
                       style={{backgroundImage: `url(${item.img})`}}></div>
                  <div className={style.notiText}>
                    <div className={style.text}>{item.message}</div>
                    <div className={style.time}>{convertTime(item.time)}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
        <Search />
      </div>
    </div>
  )
}
