/**
 * @param {Props} props - The properties for rendering.\
 * @param {boolean} [props.disabled] - A boolean to indicate state of the component.
 * @param {Function} [props.onClick] - Method to trigger on click.
 */

import Comment from "../../../assets/images/MediumComments.svg";
import SvgWrapper from "../svgWrapper/SvgWrapper";

interface props {
  disabled?: boolean;
  onClick: () => void;
}
const CommentIcon: React.FC<props> = ({ disabled = false, onClick }) => {
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
        SvgComponent={
          Comment as unknown as React.FunctionComponent<React.SVGProps<string>>
        }
        width="24px"
        disabled={disabled}
        onClick={onClick}
      />
    </div>
  );
};

export default CommentIcon;
