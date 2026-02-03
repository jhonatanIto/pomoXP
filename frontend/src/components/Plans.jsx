import { useContext, useRef, useState } from "react";
import "../styes/plans.css";
import premiumIcon from "../images/premium.png";
import { SlCheck } from "react-icons/sl";
import { GoX } from "react-icons/go";
import { UserContext } from "../context/UserContext";

const Plans = (props) => {
  const { plansPage, setPlansPage } = props;
  const boxRef = useRef();
  const [selecPlan, setSelecPlan] = useState("monthly");
  const { token } = useContext(UserContext);

  const closePlansPage = () => {
    setPlansPage(false);
    setSelecPlan("monthly");
  };

  const handleOverlayClick = (e) => {
    if (!boxRef.current.contains(e.target)) {
      closePlansPage();
    }
  };

  const handleCheckout = async (plan) => {
    const res = await fetch(
      "https://pomoxp-production.up.railway.app/api/stripe/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Athorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ plan }),
      },
    );

    const data = await res.json();

    window.location.href = data.url;
  };
  return (
    <div
      onMouseDown={(e) => handleOverlayClick(e)}
      className={`plansBody ${plansPage ? "active" : ""}`}
    >
      <div ref={boxRef} className="plansContainer">
        <div className="planHeader">
          <div className="planTitle">
            <img className="premiumIcon" src={premiumIcon} />
            Premium Plan
          </div>
          <div className="xSquare">
            <GoX className="planxButt" />
          </div>
        </div>
        <div className="planMainCont">
          <div className="moreCont">
            <div className="planMoreF">More features</div>
            <div className="planListItems">
              <SlCheck className="planCheck" />
              Access to all notes
            </div>
            <div className="planListItems">
              <SlCheck className="planCheck" />
              Report feature
            </div>
            <div className="planListItems">
              <SlCheck className="planCheck" />
              No ads
            </div>
            <div className="planListItems">
              <SlCheck className="planCheck" />
              Filter by date
            </div>
          </div>
          <div className="planBoxesCont">
            <div
              onClick={() => {
                setSelecPlan("monthly");
              }}
              className={`planBox ${selecPlan === "monthly" ? "selectedPlan" : ""}`}
            >
              <div className="planBoxTitle">MONTHLY</div>
              <div
                className={`planValue ${selecPlan === "monthly" ? "selecValue" : ""} `}
              >
                $3
              </div>
              <div className="valueSmall">/month</div>
            </div>
            <div
              onClick={() => {
                setSelecPlan("yearly");
              }}
              className={`planBox ${selecPlan === "yearly" ? "selectedPlan" : ""}`}
            >
              <div className="planBoxTitle">YEARLY</div>
              <div
                className={`planValue ${selecPlan === "yearly" ? "selecValue" : ""} `}
              >
                $25
              </div>
              <div className="valueSmall">/year</div>
            </div>
            <div
              onClick={() => {
                setSelecPlan("lifetime");
              }}
              className={`planBox ${selecPlan === "lifetime" ? "selectedPlan" : ""}`}
            >
              <div className="planBoxTitle">LIFETIME</div>
              <div
                className={`planValue ${selecPlan === "lifetime" ? "selecValue" : ""} `}
              >
                $75
              </div>
              <div className="valueSmall">/lifetime</div>
            </div>
          </div>
        </div>
        <div className="planWarning">
          * The subscription will be auto-renewed until you unsubscribe. <br />{" "}
          * You will be notified a week prior to the renewal date.
        </div>
        <button
          onClick={() => handleCheckout(selecPlan)}
          className="planPurchase"
        >
          Purchase the Plan
        </button>
      </div>
    </div>
  );
};

export default Plans;
