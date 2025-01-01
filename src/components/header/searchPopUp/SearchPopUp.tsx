/**
 * @param {ReactNode} [props.children] - The children to render.
 * @param {string} [props.searchWidth] - The width of the component.
 */

import { ReactNode, useState } from "react";

import Portal from "../../reusableComponents/portal/Portal";
import classes from "./SearchPopUp.module.css";

interface props {
  children: ReactNode[];
  searchWidth: string;
}

const SearchPopUp: React.FC<props> = ({ children, searchWidth }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <div
      className={classes.searchWrapper}
      onFocus={(e) => {
        e.nativeEvent.stopImmediatePropagation();
        setIsSearchOpen(true);
      }}
    >
      <div>{children[0]}</div>
      {isSearchOpen && (
        <Portal>
          <div
            className={classes.backdrop}
            data-testid="backdrop"
            onClick={() => {
              setIsSearchOpen(false);
            }}
          ></div>
          <div className={classes.search}>
            <h3>Search</h3>
            <hr />
            <div></div>
            <div
              style={{
                width: searchWidth,
              }}
              onClick={() => setIsSearchOpen(false)}
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
