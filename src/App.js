import "./styles.css";
import DATA from "./data";
import { useEffect, useState } from "react";
import { shuffle } from "./utils";

const countries = Object.keys(DATA);
const capitals = Object.values(DATA);
const completeData = shuffle([...countries, ...capitals]);

const findValueType = (value) => {
  if (countries.includes(value)) {
    return "country";
  }
  return "capital";
};

const SelectionBox = ({
  name,
  isCorrectSelected,
  type,
  isCurrentSelected,
  isIncorrect,
}) => {
  return (
    <span
      id={name}
      data-type={type}
      style={{
        ...(isCorrectSelected ? { visibility: "hidden", cursor: "none " } : {}),
        ...(isCurrentSelected ? { borderColor: "blue" } : {}),
        ...(isIncorrect ? { borderColor: "red" } : {}),
      }}
      className="selectionBox"
    >
      {name}
    </span>
  );
};

export default function App() {
  const [currentSelections, setCurrentSelections] = useState([]);
  const [correctSelections, setCorrectSelections] = useState([]);
  const [incorrectSelections, setIncorrectSelections] = useState([]);

  const hasGameCompleted = () =>
    correctSelections.length === completeData.length;

  const isSelected = (data) => {
    return currentSelections.map(({ value }) => value).includes(data);
  };

  useEffect(() => {
    if (incorrectSelections.length === 2) {
      const timer = setTimeout(() => {
        setIncorrectSelections([]);
      }, [1000]);
      return () => clearTimeout(timer);
    }
  }, [incorrectSelections]);

  useEffect(() => {
    // console.log(currentSelections);
    if (currentSelections.length === 2) {
      const timer = setTimeout(() => {
        const obj1 = currentSelections[0];
        const obj2 = currentSelections[1];
        if (obj1.type === "country") {
          if (DATA[obj1.value] === obj2.value) {
            setCorrectSelections([
              ...correctSelections,
              obj1.value,
              obj2.value,
            ]);
          } else {
            setIncorrectSelections([obj1.value, obj2.value]);
          }
        } else if (obj2.type === "country") {
          if (DATA[obj2.value] === obj1.value) {
            setCorrectSelections([
              ...correctSelections,
              obj1.value,
              obj2.value,
            ]);
          } else {
            setIncorrectSelections([obj1.value, obj2.value]);
          }
        } else {
          setIncorrectSelections([obj1.value, obj2.value]);
        }
        setCurrentSelections([]);
      }, [1000]);
      return () => clearTimeout(timer);
    }
  }, [currentSelections]);

  const handleSelection = (e) => {
    // console.log(e);
    const value = e.target.id;
    const type = e.target.getAttribute("data-type");
    const obj = {
      value,
      type,
    };
    if (!isSelected(value)) {
      setCurrentSelections([...currentSelections, obj]);
    } else {
      setCurrentSelections([]);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          maxWidth: "500px",
          flexWrap: "wrap",
          justifyContent: "center",
          ...(hasGameCompleted() ? { display: "none" } : {}),
        }}
        onClick={(e) => handleSelection(e)}
      >
        {completeData.map((data) => (
          <SelectionBox
            name={data}
            isCorrectSelected={correctSelections.includes(data)}
            type={findValueType(data)}
            isCurrentSelected={isSelected(data)}
            isIncorrect={incorrectSelections.includes(data)}
          />
        ))}
      </div>
      {hasGameCompleted() && <h1>Congratulations...</h1>}
    </>
  );
}
