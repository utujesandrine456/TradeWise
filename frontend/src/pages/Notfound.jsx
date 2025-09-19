import React from "react";
import styles from "./Notfound.module.css";
import {Link} from 'react-router-dom';
import not from '../assets/image1.png'

const NotFound = () => {
  return (
    <>
        <div className={styles.notfound_container}>
            
            <div className={styles.not404}>
              <img src={not} alt="Page not found" />
            </div>
        </div>
        <div className={styles.notfound_content}>
            <h2>Page Not Available</h2>
            <p>Sorry, this page isn't available<br></br> anymore or an error occured!</p>
            <button className={styles.home_link}><Link to='/'>Go Back</Link></button>
        </div>
    </>
  );
};

export default NotFound;
