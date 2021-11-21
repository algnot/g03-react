import React from 'react'
import style from './../aleart/aleart.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default function ConfirmAleart({Topic , Message , Btn , setDisplayAlert}) {

    return (
        <div className={style.container}>
            <div className={style.aleartBox}>
                <div className={style.topAlert}>
                    <div className={style.topLogo}>{Topic}</div>
                    <span className={style.closeBtn}
                          onClick={() => setDisplayAlert(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </div>
                <div className={style.message}>
                    {Message}
                </div>
            </div>
        </div>
    )
}
