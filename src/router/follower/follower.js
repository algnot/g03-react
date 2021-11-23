import React , {useEffect,useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft  } from '@fortawesome/free-solid-svg-icons'
import Navbar from '../../component/navbar/navbar'
import Search from '../../component/search/search'
import style from './follower.module.css'
import { useParams } from "react-router-dom"
import { firestore } from '../../firebase/firebase'
import { useNavigate } from "react-router-dom"

export default function Follower() { 
    let navigate = useNavigate();
    const { uid } = useParams()
    const [userInfo, setUserInfo] = useState({
      uid : '',
      username : '',
      email : '',
      photoURL : '',
      coverPhotoURL : '',
      created : '',
      role : '',
      follower : 0,
      following : 0,
      title : ''
    })

    const [users, setUsers] = useState([])

    useEffect(() => {
      const userRef = firestore.collection('users').doc(uid)
      userRef.onSnapshot(doc => {
        if(doc.exists){
          setUserInfo(doc.data())
        }
      })

      userRef.collection('follower').onSnapshot(docs => {
        var temp = []
        docs.forEach(doc => {
          temp = [...temp , doc.data().uid]
        })
        if(temp.length != 0)
          firestore.collection('users').where('uid', 'in', temp)
          .onSnapshot((docs) => {
            var temp2 = []
            docs.forEach(doc => {
              temp2 = [...temp2 , doc.data()]
            })
            setUsers(temp2)
          })
      })
    }, [])

    return (
      <div>
        <Navbar />
        <div className="content">
          <div className={style.container}>
            <div className={style.topNav}>
              <div className={style.textTopNav} >
                <FontAwesomeIcon icon={faArrowLeft} 
                               onClick={() => navigate(`/u/${uid}`)}/>
                {userInfo.username}
              </div>
              <div className={style.topNavInNav}>
                <div className={style.topNavInNavLinkActive}>
                  Follower
                </div>
                <div className={style.topNavInNavLink}
                     onClick={() => navigate(`/following/${uid}`)}>
                  Following
                </div>
              </div>
            </div>
            <div style={{marginTop:93.6}}></div>

            {
              users.map((item,index) => {
                return (
                  <div className={style.user} key={index}
                      onClick={() => navigate(`/u/${item.uid}`)}>
                    <div className={style.userImg}
                         style={{backgroundImage:`url(${item.photoURL})`}}>
                    </div>
                    <div className={style.userInfo}>
                      <div className={style.userName}>{item.username}</div>
                      <div className={style.userBio}>{item.title}</div>
                    </div>
                    <div className={style.btnEdit}>
                      follow
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
