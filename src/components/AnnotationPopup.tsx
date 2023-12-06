import { useState } from "react";

function AnnotationPopup() {
  const [value, setValue] = useState("Sample text");

  const selectList = [
    { title: "Not Solved", id: 1 },
    { title: "In Progress", id: 2 },
    { title: "Solved", id: 3 },
  ];

  const [selected, setSelected] = useState("Not Solved");
  const [bgcolor, setBgcolor] = useState("#FFD4DF");

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    if (e.target.value == "Not Solved") return setBgcolor("#FFD4DF");
    if (e.target.value == "In Progress") return setBgcolor("#FFE9BD");
    if (e.target.value == "Solved") return setBgcolor("#E6FFA5");
  };

  const id = 3;
  const username = "Yujin Lee";

  return (
    <>
      <div
        className="annotation-popup"
        style={{
          backgroundColor: bgcolor,
        }}>
        <div style={{ textAlign: "left", margin: "3%", color: "#505050" }}>
          #{id}
        </div>
        <div
          style={{
            textAlign: "left",
            margin: "3%",
            color: "#000000",
            fontWeight: "600",
          }}>
          {username}
        </div>
        <input
          className="annotation-popup-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div>
          <select
            value={selected}
            onChange={handleSelect}
            style={{ float: "left", marginLeft: "3%" }}>
            {selectList.map((item) => (
              <option value={item.title} key={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => alert(value + " / " + selected)}
            style={{ float: "right", marginRight: "3%" }}>
            Save
          </button>
          <button style={{ float: "right", marginRight: "2%" }}>Cancel</button>
        </div>
      </div>
    </>
  );
}

export default AnnotationPopup;
