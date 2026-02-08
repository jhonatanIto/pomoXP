import { useNavigate } from "react-router-dom";
import "../styes/tokushoho.css";
import { IoMdArrowRoundBack } from "react-icons/io";
const Tokushoho = () => {
  const navigate = useNavigate();
  return (
    <div className="tokushohoBody">
      <div className="tokuBack" onClick={() => navigate("/")}>
        <IoMdArrowRoundBack /> Back
      </div>
      <div className="tokushohoCont">
        <div className="linhasDoToku">
          販売事業者名: <div> Pomoxp</div>
        </div>
        <div className="linhasDoToku">
          代表者名: <div>伊藤 ジョナタン</div>{" "}
        </div>
        <div className="linhasDoToku">
          所在地: <div>ご請求があれば遅滞なく開示いたします</div>
        </div>
        <div className="linhasDoToku">
          お問い合わせ先:{" "}
          <div>E-mail: jhonatan-ito@hotmail.com 電話番号: 070-3965-8345</div>
        </div>
        <div className="linhasDoToku">
          販売価格:{" "}
          <div>
            各プランの料金は、ウェブサイト上の料金ページをご参照ください。
          </div>
        </div>
        <div className="linhasDoToku">
          商品代金以外の必要料金: <div>なし</div>{" "}
        </div>
        <div className="linhasDoToku">
          支払い方法: <div>クレジットカード決済（Stripe）</div>
        </div>
        <div className="linhasDoToku">
          支払い時期:
          <div>
            {" "}
            サブスクリプション登録時に課金され、以降は契約期間ごとに自動更新されます
          </div>
        </div>
        <div className="linhasDoToku">
          商品の引き渡し時期:{" "}
          <div>決済完了後、直ちにサービスをご利用いただけます。</div>
        </div>
        <div className="linhasDoToku">
          返品・キャンセルについて:
          <div style={{ fontSize: "16px" }}>
            {" "}
            デジタルサービスの性質上、決済完了後の返金には対応しておりません。
            ただし、法令に基づく場合を除きます。
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tokushoho;
