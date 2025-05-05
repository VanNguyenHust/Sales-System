import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Icon, Text } from "@/ui-components";
import { CircleCheckIcon } from "@/ui-icons";

type Props = {
  label: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  checked: boolean;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export const RadioTag = ({ label, icon, checked = false, value, disabled, onChange }: Props) => {
  return (
    <StyledRadioButtons
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onChange(value);
      }}
    >
      <input type="radio" name="radioname" value={value} checked={checked} readOnly />
      <div className="radio__div">
        {checked && (
          <>
            <div className="checked__background__icon" />
            <div className="checked__icon">
              {checked && <Icon source={CircleCheckIcon} color={disabled ? "base" : "primary"} />}
            </div>
          </>
        )}
        {!checked && <div className="not__selected" />}
        <div className="content__label">
          <Icon source={icon} color={`${checked && !disabled ? "primary" : "base"}`} />
          <Text as="span" truncate>
            {label}
          </Text>
        </div>
      </div>
    </StyledRadioButtons>
  );
};

const StyledRadioButtons = styled.div<{ disabled?: boolean }>`
  margin: 0 10px;
  cursor: pointer;
  .radio__div {
    position: relative;
    padding: 0 24px;
    border-radius: 6px;
    ${(p) =>
      p.disabled
        ? css`
            border: 1px solid ${p.theme.colors.borderDisabled};
            background-color: ${p.theme.colors.backgroundHoverred};
          `
        : css`
            border: 1px solid #d3d5d7;
          `};
  }
  .not__selected {
    position: absolute;
    background-color: #fff;
    top: 25%;
    left: -10px;
  }
  .checked__background__icon {
    position: absolute;
    top: 11px;
    left: -12px;
    background: #fff;
    width: 17px;
    height: 17px;
  }
  .checked__icon {
    position: absolute;
    top: 20%;
    left: -12px;
    span {
      width: 23px;
      height: 23px;
    }
  }
  .not__selected {
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.background};
    border: 1px solid #d3d5d7;
    width: 20px;
    height: 20px;
  }
  .content__label {
    height: 40px;
    line-height: 40px;
    display: flex;
    gap: 8px;
    width: fit-content;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
  }
  input {
    /* HIDE RADIO */
    visibility: hidden; /* Makes input not-clickable */
    position: absolute; /* Remove input from document flow */
  }
  input:checked + div {
    /* (RADIO CHECKED) DIV STYLES */
    border: ${(props) =>
      `1px solid ${props.disabled ? props.theme.colors.actionPrimaryDisabled : props.theme.colors.actionPrimary}`};
    color: ${(props) => (props.disabled ? props.theme.colors.textDisabled : props.theme.colors.actionPrimary)};
    transition: all 0.2s ease-in-out;
  }
`;
