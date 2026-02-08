import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Contact = () => {
  const navigate = useNavigate();
  return (
    <div className="tokushohoBody">
      <div className="tokuBack" onClick={() => navigate("/")}>
        <IoMdArrowRoundBack /> Back
      </div>
      <div className="contactCont">
        <div className="privacyTitle">Contact</div>
        <p>
          If you have any questions, please contact us on either of the
          following methods.
        </p>
        <div style={{ marginTop: "30px" }}>
          <div>Email:jhonatan-ito@hotmail.com</div>
          <div>
            Twitter:{" "}
            <a
              style={{ color: "rgb(250, 75, 75)" }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://x.com/pomoxp49750"
            >
              twitter.com/pomoxp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
