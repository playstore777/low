import Comment from "../../../assets/images/MediumComments.svg";
import SvgWrapper from "../svg/SvgWrapper";

const CommentsIcon = ({
  disabled = false,
  onClick,
}: {
  disabled?: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        userSelect: "none",
      }}
    >
      <SvgWrapper
        SvgComponent={Comment}
        width="24px"
        disabled={disabled}
        onClick={onClick}
      />
    </div>
  );
};

export default CommentsIcon;
