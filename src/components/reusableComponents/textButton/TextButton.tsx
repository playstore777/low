import classes from "./TextButton.module.css";

const TextButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  return (
    <span className={classes.textButton} onClick={onClick}>
      {label}
    </span>
  );
};

export default TextButton;
