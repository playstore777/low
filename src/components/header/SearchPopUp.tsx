import { ReactNode, useRef, useState } from "react";
import classes from "./SearchPopUp.module.css";

const SearchPopUp = ({
  children,
  searchWidth,
}: {
  children: ReactNode[];
  searchWidth: string;
}) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className={classes.searchWrapper}>
      <div
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        {children[0]}
      </div>
      {isDropdownOpen && (
        <div className={classes.search}>
          <h3>Search</h3>
          <hr />
          <div></div>
          <div
            ref={searchRef}
            style={{
              width: searchWidth,
            }}
            className={classes.dropdown}
          >
            {children[1]}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPopUp;
