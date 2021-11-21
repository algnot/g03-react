import React from 'react';
import style from './Profile.module.css';
import Navbar from "../../component/navbar/navbar";

export default function Profile(){
    return (
      <>
        <div className={style.container}>
          <Navbar />
          <div className="content">
            <div className={style.profilecontainer}>
              <div className={style.profiletop}>
                <div className={style.profilecover}>
                  {/* <img
                    src="https://images.wallpaperscraft.com/image/single/coast_sea_rock_226040_1920x1080.jpg"
                    className={style.imgcover}
                  /> */}
                  <img
                    src="https://i.pinimg.com/474x/3e/00/cb/3e00cb772cb221c347d098031b4640a9.jpg"
                    className={style.imgprofile}
                  />
                </div>
                <div className={style.profileinfo}>
                  <div className={style.profilename}>Levi Ackerman</div>
                  <div className={style.profiledesc}>
                    afjklasdj;fkakfkjhfla;j;h
                  </div>
                </div>
              </div>
              <div className={style.profilebottom}></div>
            </div>
          </div>
        </div>
      </>
    );
}