import classes from "./Avatar.module.css";

const Avatar = ({
  imgSrc,
  imgTitle,
  width,
  height,
}: {
  imgSrc?: string;
  imgTitle?: string;
  width?: string;
  height?: string;
}) => {
  return (
    <div className={classes.avatar} style={{ width: width, height: height }}>
      {!imgSrc && <div className={classes.avatarPlaceholder}></div>}
      {imgSrc && <img title={imgTitle} alt="" src={imgSrc} loading="lazy" />}
    </div>
  );
};

export default Avatar;
