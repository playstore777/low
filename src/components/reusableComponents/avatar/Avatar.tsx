/**
 * @param {Props} props - The properties for rendering.
 * @param {string} [props.imgSrc] - The image source string.
 * @param {string} [props.imgTitle] - The image title string.
 * @param {string} [props.width] - The width of the component
 * @param {string} [props.height] - The height of the component
 */

import classes from "./Avatar.module.css";

interface props {
  imgSrc?: string;
  imgTitle?: string;
  width?: string;
  height?: string;
}

const Avatar: React.FC<props> = ({ imgSrc, imgTitle, width, height }) => {
  return (
    <div className={classes.avatar} style={{ width: width, height: height }}>
      {!imgSrc && <div className={classes.avatarPlaceholder}></div>}
      {imgSrc && <img title={imgTitle} alt="" src={imgSrc} loading="lazy" />}
    </div>
  );
};

export default Avatar;
