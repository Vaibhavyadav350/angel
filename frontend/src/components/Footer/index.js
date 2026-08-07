import React from 'react';
import { socialLinks, footerLinks } from "../../utils/constants";
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div>
      <div className="footerSocialLinks">
        {socialLinks.map((link) => {
          const { url, icon, text } = link;
          return (
            <div key={text}>
              <a href={url}>{icon}</a>
            </div>
          );
        })}
      </div>
      <div className="footerLinks">
        {footerLinks.map((link) => {
          const { url, text, id } = link;
          return (
            <div key={id}>
              {id === 4 ? <a href='mailto:support@angelfashionstudio.org'>{text}</a>
                :
                <Link to={url}>{text}</Link>
              }
            </div>
          );
        })}
      </div>
      <div className='underline'>
      </div>
      <h5>
        &copy; {new Date().getFullYear()}
        <span> Angel Fashion Studio </span>
        - All Rights Reserved
      </h5>
    </div>
  );
};

export default Footer;
