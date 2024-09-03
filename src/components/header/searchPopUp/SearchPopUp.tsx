import { ReactNode, useRef, useState } from "react";

import Portal from "../../reusableComponents/portal/Portal";
import classes from "./SearchPopUp.module.css";

const SearchPopUp = ({
  children,
  searchWidth,
}: {
  children: ReactNode[];
  searchWidth: string;
}) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <div className={classes.searchWrapper}>
      <div
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation();
          setIsSearchOpen(true);
        }}
      >
        {children[0]}
      </div>
      {isSearchOpen && (
        <Portal>
          <div
            className={classes.backdrop}
            onClick={() => {
              console.log("clicked");
              setIsSearchOpen(false);
            }}
          ></div>
          <div className={classes.search}>
            <h3>Search</h3>
            <hr />
            <div></div>
            <div
              ref={searchRef}
              style={{
                width: searchWidth,
              }}
            >
              {children[1]}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default SearchPopUp;
