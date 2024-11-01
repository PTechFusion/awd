import React from "react";
import "./index.css";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
const Enter = () => {
  return (
    <div className="signup__right">
      <div className="signup__right__content">
        <div className="signup__top2">
          <a href="" target="_blank"  className="login__back">
          Pump.fun
          </a>
          <p className="signup__top__larger">
            <a href="https://x.com/MiraDevelopment" target="_blank"  className="signup__login">
              Twitter
            </a>
          </p>
        </div>
        <div className="signup__top">
          <a href="" target="_blank" className="login__back">
            Pump.fun
          </a>
          <p className="signup__top__larger">
            <a href="https://x.com/MiraDevelopment" target="_blank" className="signup__login">
              Twitter
            </a>
          </p>
        </div>
        <div className="signup__form__container">
          <form action="" className="signup__form">
            <h3>Get Started Using $Mira</h3>

            <div className="signup__input__div">
              <label htmlFor="signup__username" className="username-label">
                <FontAwesomeIcon icon={faUser} className="icon__color" />
              </label>
              <input
                required
                type="text"
                id="signup__username"
                placeholder="Username"
                className="signup__input"
                value={"Mira"}
              />
            </div>
            <div className="signup__input__div">
              <label htmlFor="signup__password" className="password-label">
                <FontAwesomeIcon icon={faLock} className="icon__color" />
              </label>
              <input
                minLength={6}
                required
                type="text"
                id="signup__password"
                name="password"
                placeholder="Password"
                className="signup__input"
                value={"$Mira"}
              />
            </div>
            <Link to='/chat' className="signup__button">
              Enter
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Enter;
