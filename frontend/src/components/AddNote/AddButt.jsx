import add from "../../images/add.png";
const AddButt = (props) => {
  const { setNoteModal } = props;
  return (
    <div className="addNoteContainer">
      <div className="imgCont">
        <img onClick={() => setNoteModal(true)} className="addImg" src={add} />
        <div className="addAlert">Add new note</div>
      </div>
    </div>
  );
};

export default AddButt;
