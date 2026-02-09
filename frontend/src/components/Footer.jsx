import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="footerCont">
      <div className="footerLinksCont">
        <div className="footerLink" onClick={() => navigate("/privacy")}>
          Privacy
        </div>
        <div className="footerLink" onClick={() => navigate("/terms")}>
          Terms
        </div>
        <div className="footerLink" onClick={() => navigate("/contact")}>
          Contact
        </div>
        <div className="footerLink jpjp" onClick={() => navigate("/tokushoho")}>
          特定商取引法に基づく表記
        </div>
      </div>
      <div className="madeByCont">Made by Jhonatan Ito</div>
    </div>
  );
};

export default Footer;
