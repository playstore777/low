import Clap from "../../../assets/images/MediumClap.svg";
import SvgWrapper from "../svg/SvgWrapper";

const ClapIcon = ({
  disabled,
  onClick,
  label,
}: {
  disabled: boolean;
  onClick: () => void;
  label: number;
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
        SvgComponent={Clap}
        width="24px"
        disabled={disabled}
        onClick={onClick}
      />
      {label}
    </div>
  );
};

export default ClapIcon;
