import { useContext, useEffect, useRef, useState } from "react";
import "../styes/plans.css";
import premiumIcon from "../images/premium.png";
import { SlCheck } from "react-icons/sl";
import { GoX } from "react-icons/go";
import { UserContext } from "../context/UserContext";

const Plans = (props) => {
  const { plansPage, setPlansPage } = props;
  const boxRef = useRef();
  const [selecPlan, setSelecPlan] = useState("monthly");
  const { token, setLoading, user } = useContext(UserContext);

  const closePlansPage = () => {
    setPlansPage(false);
    currentPlanDisplay();
  };

  useEffect(() => {
    currentPlanDisplay();
  }, [user]);

  const currentPlanDisplay = () => {
    if (!user) return;
    const planSelec = user.plan !== "free" ? user.plan : "monthly";
    setSelecPlan(planSelec);
  };

  const handleOverlayClick = (e) => {
    if (!boxRef.current.contains(e.target)) {
      closePlansPage();
    }
  };

  const handleCheckout = async (plan) => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://pomoxp-production.up.railway.app/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({ plan }),
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Stripe backend error:", errorText);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!data.url) {
        console.error("Stripe response missing url:", data);
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
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
          <div onClick={closePlansPage} className="xSquare">
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
              className={`planBox  ${selecPlan !== "monthly" ? "planBoxH" : ""} ${selecPlan === "monthly" ? "selectedPlan " : ""}`}
            >
              <div
                style={{ display: user?.plan === "monthly" ? "flex" : "none" }}
                className="currentPlanUp"
              >
                current plan
              </div>
              <div className="planBoxTitle">MONTHLY</div>
              <div
                className={`planValue ${selecPlan === "monthly" ? "selecValue" : ""} `}
              >
                $3
              </div>
              <div className="valueSmall">/per month</div>
              <div className="saveMoney noopa">Save 34 dollars</div>
            </div>
            <div
              onClick={() => {
                setSelecPlan("yearly");
              }}
              className={`planBox  ${selecPlan !== "yearly" ? "planBoxH" : ""} ${selecPlan === "yearly" ? "selectedPlan" : ""}`}
            >
              <div
                style={{ display: user?.plan === "yearly" ? "flex" : "none" }}
                className="currentPlanUp"
              >
                current plan
              </div>
              <div className="planBoxTitle">YEARLY</div>
              <div
                className={`planValue ${selecPlan === "yearly" ? "selecValue" : ""} `}
              >
                $26
              </div>
              <div className="valueSmall">/per year</div>
              <div className="saveMoney">Save 10 dollars</div>
            </div>
            <div
              onClick={() => {
                setSelecPlan("threeYears");
              }}
              className={`planBox  ${selecPlan !== "threeYears" ? "planBoxH" : ""} ${selecPlan === "threeYears" ? "selectedPlan" : ""}`}
            >
              <div
                style={{
                  display: user?.plan === "threeYears" ? "flex" : "none",
                }}
                className="currentPlanUp"
              >
                current plan
              </div>
              <div className="planBoxTitle">3 YEARS</div>
              <div
                className={`planValue ${selecPlan === "threeYears" ? "selecValue" : ""} `}
              >
                $74
              </div>
              <div className="valueSmall">/every 3 years</div>
              <div className="saveMoney">Save 34 dollars</div>
            </div>
          </div>
        </div>
        <div className="planWarning">
          * The subscription will be auto-renewed until you unsubscribe. <br />{" "}
          * You will be notified a week prior to the renewal date.
        </div>
        <div className="planButtCont">
          <button
            style={{ display: user?.plan === "free" ? "none" : "flex" }}
            className="planCancel"
          >
            Cancel plan
          </button>
          <button
            onClick={() => handleCheckout(selecPlan)}
            className="planPurchase"
          >
            {user?.plan === "free" ? "Purchase plan" : "Upgrade plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Plans;

export function Success() {
  return (
    <div>
      <h1>Payment confimed!</h1>
      <p>Your subscription is activeted</p>
    </div>
  );
}

export function Cancel() {
  return (
    <div>
      <h1>Payment cancelled</h1>
      <p>You can try again</p>
    </div>
  );
}
