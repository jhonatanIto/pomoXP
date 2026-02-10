import { useContext, useEffect, useRef, useState } from "react";
import "../styes/plans.css";
import premiumIcon from "../images/premium.png";
import { SlCheck } from "react-icons/sl";
import { GoX } from "react-icons/go";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";

const Plans = (props) => {
  const { plansPage, setPlansPage } = props;
  const boxRef = useRef();
  const cancelRef = useRef();
  const [selecPlan, setSelecPlan] = useState("monthly");
  const [cancelModal, setCancelModal] = useState(false);
  const { token, setLoading, user } = useContext(UserContext);
  const { successNotification, errorNotification } =
    useContext(NotificationContext);

  const closePlansPage = () => {
    setPlansPage(false);
    setCancelModal(false);
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

  const handleCancel = (e) => {
    if (!cancelRef.current.contains(e.target)) {
      setCancelModal(false);
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

          body: JSON.stringify({ plan: plan }),
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

  const handleCancelPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://pomoxp-production.up.railway.app/api/stripe/cancelSubscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Stripe backend error:", errorText);
        return;
      }

      const data = await res.json();

      successNotification("Your plan was canceled");
      console.log(data);
    } catch (error) {
      errorNotification("Error to cancel");
      console.error(error);
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
              Early Reports
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
                <div
                  style={{
                    color: user?.cancel_at_period_end
                      ? "rgb(250, 75, 75)"
                      : "#2357dc",
                  }}
                >
                  {user?.cancel_at_period_end
                    ? "until " + user?.subscription_end_date.split("T")[0]
                    : "current plan"}
                </div>
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
                <div
                  style={{
                    color: user?.cancel_at_period_end
                      ? "rgb(250, 75, 75)"
                      : "#2357dc",
                  }}
                >
                  {user?.cancel_at_period_end
                    ? "until " + user?.subscription_end_date.split("T")[0]
                    : "current plan"}
                </div>
              </div>
              <div className="planBoxTitle">YEARLY</div>
              <div
                className={`planValue ${selecPlan === "yearly" ? "selecValue" : ""} `}
              >
                $24
              </div>
              <div className="valueSmall">$2/per month</div>
              <div className="saveMoney">Save 12 dollars</div>
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
                <div
                  style={{
                    color: user?.cancel_at_period_end
                      ? "rgb(250, 75, 75)"
                      : "#2357dc",
                  }}
                >
                  {user?.cancel_at_period_end
                    ? "until " + user?.subscription_end_date.split("T")[0]
                    : "current plan"}
                </div>
              </div>
              <div className="planBoxTitle">3 YEARS</div>
              <div
                className={`planValue ${selecPlan === "threeYears" ? "selecValue" : ""} `}
              >
                $66
              </div>
              <div className="valueSmall">$1.83/per month</div>
              <div className="saveMoney">Save 42 dollars</div>
            </div>
          </div>
        </div>
        <div className="planWarning">
          * The subscription will be auto-renewed until you unsubscribe. <br />{" "}
          * You will be notified a week prior to the renewal date.
        </div>
        <div
          style={{
            display: user?.cancel_at_period_end ? "none" : "flex",
          }}
          className="planButtCont"
        >
          <button
            style={{
              display: user?.plan === "free" ? "none" : "flex",
            }}
            className="planCancel"
            onClick={() => setCancelModal(true)}
          >
            Cancel plan
          </button>
          <button
            style={{
              display: user?.plan === "free" ? "flex" : "none",
            }}
            onClick={() => handleCheckout(selecPlan)}
            className="planPurchase"
          >
            Purchase plan
          </button>
        </div>
      </div>
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          handleCancel(e);
        }}
        className={`cancelModal ${cancelModal ? "active" : ""}`}
      >
        <div
          onMouseDown={(e) => e.stopPropagation()}
          ref={cancelRef}
          className="cancelCont"
        >
          <div className="cancelModalTitle">Are you sure?</div>
          <p className="cancelSure">You will lose Premium features, such as:</p>
          <ul className="listCancel">
            <li>Unlimited access to all Notes</li>
            <li>Filter by date features</li>
            <li>Premium Report features</li>
            <li>No ads</li>
          </ul>
          <div className="cancelPlanButts">
            <button
              onClick={() => setCancelModal(false)}
              className="cancelCancelP"
            >
              cancel
            </button>
            <button
              onClick={() => {
                handleCancelPlan();
                setCancelModal(false);
              }}
              className="confirmCancelP"
            >
              confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;

export function Success(props) {
  const { paySuccess, setPaySuccess } = props;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className={`paySuccessBody ${paySuccess ? "active" : ""}`}>
      <div className="paySuccessCont">
        <h1 className="payTitle">Congratulations, {user?.name} !</h1>
        <p>You Activeted the Premium plan ! </p>

        <p>
          Now you have unlimited access to all Notes, access to Yealy Bars and
          Filters.
        </p>
        <p>And of course, No more ads.</p>

        <button
          onClick={() => {
            setPaySuccess(false);
            navigate("/", { replace: true });
          }}
        >
          ok
        </button>
      </div>
    </div>
  );
}

export function Cancel(props) {
  const { payCancel, setPayCancel } = props;

  const navigate = useNavigate();

  return (
    <div className={`paySuccessBody ${payCancel ? "active" : ""}`}>
      <div className="paySuccessCont">
        <h1 className="payTitle">Payment cancelled</h1>
        <p>The payment process was not completed.</p>
        <p>
          {" "}
          This can happen if you closed the checkout or your bank required
          additional confirmation.
        </p>

        <button
          onClick={() => {
            setPayCancel(false);
            navigate("/", { replace: true });
          }}
        >
          ok
        </button>
      </div>
    </div>
  );
}
