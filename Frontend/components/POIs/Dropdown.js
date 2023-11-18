import DropDownPicker from "react-native-dropdown-picker";
import React, { useState } from "react";
import { useEffect } from "react";

function Dropdown(value, setValue, numOfDays) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    for (let i = 1; i <= numOfDays; i++) {
      setItems((items) => [...items, { label: "day " + i, value: i }]);
    }
    console.log("Dropdown Reloaded");
    console.log("numOfDays: ", numOfDays);
  }, [numOfDays, loading]);
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />
  );
}

export default Dropdown;
