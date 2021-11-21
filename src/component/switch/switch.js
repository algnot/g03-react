import React, { useState, useEffect } from "react";
import "./ToggleSwitch.css";
import { getTheme, changeMode } from "../../theme/theme";
 
function ToggleSwitch() {
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    if (getTheme() == "theme-dark") {
      setIsToggled(false);
    } else {
      setIsToggled(true);
    }
  }, []);

  const onToggle = () => {
    setIsToggled(!isToggled);
    changeMode();
  };

  return (
    <div style={{width:100}}>
    <div className="container-switch">
      <input
        type="checkbox"
        id="toggle"
        className="toggle--checkbox"
        checked={isToggled}
        onChange={onToggle}
      />
      <label for="toggle" className="toggle--label">
        <span className="toggle--label-background"></span>
      </label>
    </div>
    </div>
  );
}
export default ToggleSwitch;