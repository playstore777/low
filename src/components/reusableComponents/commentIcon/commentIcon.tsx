import Comment from "../../../assets/images/MediumComments.svg";
import SvgWrapper from "../svgWrapper/SvgWrapper";

const CommentIcon = ({
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

export default CommentIcon;
