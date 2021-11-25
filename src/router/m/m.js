import React from 'react'
import Navbar from '../../component/navbar/navbar'
import Search from '../../component/search/search'
import style from './m.module.css'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft  } from '@fortawesome/free-solid-svg-icons'

export default function M() {

  let navigate = useNavigate();
    return (
      <div>
        <Navbar />
        <div className="content">
          <div className={style.container}>
            <div className={style.topNav}>
              <FontAwesomeIcon icon={faArrowLeft} 
                               onClick={() => navigate(`/message`)}/>
              <div className={style.textTopNav} >
                cadfwg
              </div>
            </div>
            <div style={{marginTop:59}}></div>
            <div className={style.messageContainer}>

            </div>
            <div className={style.messageBar}>
              <input placeholder="type something" />
            </div>
          </div>
          <Search />
        </div>
      </div>
    )
}
