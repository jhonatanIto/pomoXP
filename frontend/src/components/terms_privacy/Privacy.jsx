import { useNavigate } from "react-router-dom";
import "../../styes/privacy.css";
import { IoMdArrowRoundBack } from "react-icons/io";
const Privacy = () => {
  const navigate = useNavigate();
  return (
    <div className="tokushohoBody">
      <div className="priBack" onClick={() => navigate("/")}>
        <IoMdArrowRoundBack /> Back
      </div>
      <div className="privacyCont">
        <div className="privacyTitle">Privacy Policy</div>
        <p>Last updated: February 2026</p>

        <p>
          PomoXP respects your privacy and is committed to protecting your
          personal information.
        </p>
        <h2>1. Information We Collect</h2>
        <p>
          We may collect the following information when you use our service:
        </p>
        <ul>
          <li>Name and email address</li>
          <li>Account and login information</li>
          <li>Usage data related to app features</li>
          <li>Payment-related information (processed securely by Stripe)</li>
        </ul>
        <p>We do not store full credit card numbers on our servers.</p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>Provide and operate the service</li>
          <li>Manage user accounts and subscriptions</li>
          <li>Process payments and prevent fraud</li>
          <li>Improve our product and user experience</li>
          <li>Communicate with users regarding service updates</li>
        </ul>

        <h2>3. Payment Processing</h2>
        <p>
          Payments are processed by Stripe. Your payment information is handled
          directly by Stripe in accordance with their privacy and security
          policies.
        </p>

        <h2>4. Data Sharing</h2>
        <p>
          We do not sell or rent your personal data. We may share information
          with trusted third-party services only when necessary to operate the
          service (such as payment processing).
        </p>

        <h2>5. Data Security</h2>
        <p>
          We implement reasonable security measures to protect user information
          from unauthorized access, alteration, or disclosure.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          We retain personal data only as long as necessary to provide the
          service and comply with legal obligations.
        </p>

        <h2>7. Your Rights</h2>
        <p>
          Users may request access, correction, or deletion of their personal
          information by contacting us.
        </p>

        <h2>8. Contact</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p>
          Email: <strong>support@pomoxp.com</strong>
        </p>
      </div>
    </div>
  );
};

export default Privacy;
