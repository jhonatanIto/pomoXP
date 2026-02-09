import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Terms = () => {
  const navigate = useNavigate();
  return (
    <div className="tokushohoBody">
      <div className="termsCont">
        <h1 className="privacyTitle">Terms & Conditions</h1>
        <p className="terms-updated">Last updated: February 2026</p>

        <p style={{ marginTop: "30px" }}>
          These Terms & Conditions ("Terms") govern your use of Pomoxp ("we",
          "our", or "us"). By accessing or using our service, you agree to be
          bound by these Terms.
        </p>

        <h2>1. Use of the Service</h2>
        <p>
          Pomoxp is a productivity and focus tracking service. You agree to use
          the service only for lawful purposes and in accordance with these
          Terms.
        </p>

        <h2>2. User Accounts</h2>
        <p>
          To access certain features, you may be required to create an account.
          You are responsible for maintaining the confidentiality of your login
          information and for all activities that occur under your account.
        </p>

        <h2>3. Subscriptions and Payments</h2>
        <p>
          Some features of the service require a paid subscription. Payments are
          processed through Stripe and are billed on a recurring basis according
          to the selected plan.
        </p>
        <p>
          Unless otherwise stated, subscription fees are non-refundable, except
          where required by applicable law.
        </p>

        <h2>4. Cancellation</h2>
        <p>
          You may cancel your subscription at any time. Upon cancellation, you
          will continue to have access to paid features until the end of the
          current billing period.
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          All content, features, and functionality of Pomoxp, including text,
          graphics, logos, and software, are the property of Pomoxp and are
          protected by applicable intellectual property laws.
        </p>

        <h2>6. Prohibited Activities</h2>
        <ul>
          <li>Attempting to gain unauthorized access to the service</li>
          <li>Using the service for illegal or harmful activities</li>
          <li>Interfering with the operation or security of the service</li>
        </ul>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Pomoxp shall not be liable for
          any indirect, incidental, or consequential damages arising from the
          use of the service.
        </p>

        <h2>8. Service Availability</h2>
        <p>
          We do not guarantee that the service will be available at all times or
          free from errors. We may suspend or discontinue the service at any
          time without prior notice.
        </p>

        <h2>9. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the
          service after changes become effective constitutes acceptance of the
          updated Terms.
        </p>

        <h2>10. Contact</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p>
          Email: <strong>support@pomoxp.com</strong>
        </p>
      </div>
      <div className="termsBack" onClick={() => navigate("/")}>
        <IoMdArrowRoundBack /> Back
      </div>
    </div>
  );
};

export default Terms;
