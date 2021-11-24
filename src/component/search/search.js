import React , {useEffect,useState} from 'react'
import { auth, firestore } from '../../firebase/firebase'
import style from './search.module.css'
import { useNavigate } from "react-router-dom"

export default function Search() {
    let navigate = useNavigate();

    const [text, setText] = useState('')

    const [user, setUser] = useState([{
        uid : '',
        username : '',
        email : '',
        photoURL : ''
    }])

    const [userSearch, setUserSearch] = useState([])

    const onSearch = (text) => {
        setUserSearch([])
        if(!text) {
            setText('')
            setUserSearch([])
            return
        }
        setText(text)
        const resultRef = firestore.collection('users').where('username' , '==' , text).limit(5)
        resultRef.get()
        .then(docs => {
            var temp = []
            docs.forEach(doc => {
                temp = [...temp , doc.data()]
            })
            setUserSearch(temp);
        })
    }

    useEffect(() => {
        auth.onAuthStateChanged( user => {
            if(user){
                const userRef = firestore.collection('users').limit(5)
                .where('uid','!=',user.uid)
                userRef.onSnapshot( docs => {
                    var temp = []
                    docs.forEach(doc => {
                        temp = [...temp , doc.data()]
                    })
                    setUser(temp)
                })
            }
        })
    }, [])

    return (
        <div className={style.container}>
            <input className={style.searchInput}
                   placeholder="Search.."
                   onChange={(e) => onSearch(e.target.value)}
                   value={text}/>
                {
                    userSearch.length > 0 && 
                    <div className={style.searchContainer}>
                    {
                        userSearch.map((item,index) => {
                            return (
                                <div className={style.user}
                                    onClick={() => {window.location.href=`/u/${item.uid}`}}
                                     key={index}>
                                    <div className={style.userImg}
                                         style={{backgroundImage:`url('${item.photoURL ? item.photoURL : 'https://firebasestorage.googleapis.com/v0/b/g03-project.appspot.com/o/u%2Fbasic_img%2Fmain%2Fimages.jpg?alt=media&token=d3f747ad-71ab-4014-b67d-7c235fc980d4'}')`}}>
                                    </div>
                                    <div className={style.userName}>
                                        {item.username}
                                        <div className={style.userEmail}>
                                        {item.email}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                }
            <div className={style.friendBox}>
                <div className={style.friendBoxText}>
                    Who should I follow?
                </div>
                {
                    user.map((item,index) => {
                        return (
                            <div className={style.user}
                                onClick={() => {window.location.href=`/u/${item.uid}`}}
                                 key={index}>
                                <div className={style.userImg}
                                     style={{backgroundImage:`url('${item.photoURL ? item.photoURL : 'https://firebasestorage.googleapis.com/v0/b/g03-project.appspot.com/o/u%2Fbasic_img%2Fmain%2Fimages.jpg?alt=media&token=d3f747ad-71ab-4014-b67d-7c235fc980d4'}')`}}>
                                </div>
                                <div className={style.userName}>
                                    {item.username}
                                    <div className={style.userEmail}>
                                    {item.email}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}


