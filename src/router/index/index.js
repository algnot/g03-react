import React from 'react'
import style from './index.module.css'
import Navbar from '../../component/navbar/navbar'
import Post from '../../component/post/post'

export default function Index() {
    return (
      <div className={style.container}>
        <Navbar />
        <div className="content">
          <div>
            <Post/>
            <Post/>
            <Post/>
          </div>
            
        </div>
      </div>
    );
}
