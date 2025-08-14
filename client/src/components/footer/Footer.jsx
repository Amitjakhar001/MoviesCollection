import React from "react";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

import ContentWrapper from "../contentWrapper/ContentWrapper";

import "./style.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <ContentWrapper>
        <ul className="menuItems">
          <li className="menuItem">Happy to see you here</li>
          <li className="menuItem">! explore my portfolio also</li>
          {/* <li className="menuItem">About</li> */}
          {/* <li className="menuItem">Blog</li> */}
          {/* <li className="menuItem">FAQ</li> */}
        </ul>
        <div className="infoText">
          Developers - Amit jakhar(IIT Bhilai), Ankit jakhar(NIT KUK)
        </div>
        <div className="socialIcons">
          <span className="icon">
            <a href="https://www.instagram.com/amitjakhar___/">
              <FaInstagram />
            </a>
          </span>
          <span className="icon">
            <a href="https://www.linkedin.com/in/amit-jakhar-3b06a0243">
              <FaLinkedin />
            </a>
          </span>
          <span className="icon">
            <a href="https://github.com/Amitjakhar001">
              <FaGithub />
            </a>
          </span>
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
