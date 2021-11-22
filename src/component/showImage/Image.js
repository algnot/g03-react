import React from 'react'
import style from './Image.module.css'

export default function Image({url , close}) {
    return (
        <div className={style.container}
             onClick={close}>
            <img src={url} alt="Profile-image" />
        </div>
    )
}
