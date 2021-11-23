import React, {useEffect,useState} from 'react'
import style from './index.module.css'
import Navbar from '../../component/navbar/navbar'
import Post from '../../component/post/post'
import Search from '../../component/search/search'
import CreatePost from '../../component/createpost/createpost'
import { firestore } from '../../firebase/firebase'

export default function Index() {

  const [post, setPost] = useState([])

  useEffect(() => {
    firestore.collection('posts')
    .orderBy('time','desc')
    .onSnapshot(docs => {
      var temp = []
      docs.forEach(doc => {
        temp = [...temp , doc.data()]
      })
      setPost(temp)
    })
  }, [])

  return (
    <div>
      <Navbar />
      <div className="content">
        <div className={style.container}>
          <div className={style.topNav}>
            <div className={style.textTopNav} >
              Home
            </div>
          </div>
          <div style={{marginTop:59}}></div>
          <CreatePost subpost={0} />
          {
            post.map((item,index) => {
              return <Post key={index} item={item}/>
            })
          }
        </div>
        <Search />
      </div> 
    </div>
  );
}
