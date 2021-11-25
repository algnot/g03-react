import React from 'react'
import Navbar from '../../component/navbar/navbar'
import Search from '../../component/search/search'
import style from './message.module.css'

export default function Message() {
    return (
      <div>
        <Navbar />
        <div className="content">
          <div className={style.container}>
            <div className={style.topNav}>
              <div className={style.textTopNav} >
                Message
              </div>
            </div>
            <div style={{marginTop:59}}></div>
            <div className={style.searchBar}>
              <input placeholder="find people.." />
            </div>
          </div>
          <Search />
        </div>
      </div>
    )
}
