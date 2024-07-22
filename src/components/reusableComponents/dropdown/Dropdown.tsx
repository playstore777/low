import { useRef, useState, useEffect, ReactNode } from "react";

import classes from "./Dropdown.module.css";

const Dropdown = ({
  buttonStyles,
  children,
  dropdownWidth,
}: {
  buttonStyles?: string;
  children: ReactNode[];
  dropdownWidth?: string;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // event listener for when click outside of dropdown
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;

      if (
        !dropdownRef.current?.contains(target) ||
        target.closest("a") ||
        target.closest("button")
      ) {
        // if clicked outside of dropdown menu or clicked interactive element, close it.
        setIsDropdownOpen(false);
      }
    }

    //#region drawback, if any other feature overwrites this, then it will not work, need to find a better alternative!
    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
    //#endregion
  }, []);

  return (
    <div className={classes.dropdownWrapper}>
      <button
        className={buttonStyles}
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        {children[0]}
      </button>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          style={{
            width: dropdownWidth,
          }}
          className={classes.dropdown}
        >
          {children[1]}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
