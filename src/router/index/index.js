import React from 'react'
import style from './index.module.css'
import Navbar from '../../component/navbar/navbar'
import Post from '../../component/post/post'
import Tophome from '../../component/Tophome/tophome'
import Search from '../../component/search/search'

export default function Index() {
    return (
      <div className={style.container}>
        <Navbar />
        <div className="content">
          <div>
            <Tophome/>
            <Post/>
            <Post/>
            <Post/> 
          </div> 
          <Search/>
        </div>
      </div>
    );
}
