import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import "./index.css";
const Right = () => {
  return (
    <div className="signup__left">
      <div className="signup__left__content">
        <div className="signup__left__flex">
          <div className="signup__left__title">
            <h3>Mira AI</h3>
            <p>Interact with Mira Ai and learn about solana memecoins!</p>
          </div>
          <div className="signup__box">
            <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#000" }} />
            <div className="signup__box__text">
              <p className="signup__box__title">Get Updated Responses</p>
              <p className="signup__box__des">
                Guaranteed up to date memecoin <br />
                data in the solana ecosystem
              </p>
            </div>
          </div>
          <div className="signup__box">
            <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#000" }} />
            <div className="signup__box__text">
              <p className="signup__box__title">Ask And Recieve A Responce</p>
              <p className="signup__box__des">
              Dive into Mira AI and stay updated <br />
              with the current trends of Solana memes
              </p>
            </div>
          </div>
          <div className="signup__box">
            <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#000" }} />
            <div className="signup__box__text">
              <p className="signup__box__title">Use Exclusive Tools</p>
              <p className="signup__box__des">
                Launch your own memecoins <br />
                using Mira AI through pump.fun
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Right;
