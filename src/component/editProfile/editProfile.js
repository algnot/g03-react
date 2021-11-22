import React from 'react'
import style from './editProfile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default function EditProfile({uid , close}) {
    return (
        <div className={style.container}>
            <div className={style.editBox}>
                <div className={style.navEditBox}>
                    <FontAwesomeIcon icon={faTimes}/>
                </div>
                
            </div>
        </div>
    )
}
