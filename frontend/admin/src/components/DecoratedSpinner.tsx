import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export const DecoratedSpinner = () => {
  return (
    <StyledSpinnerWrapper>
      <StyledSpinner />
    </StyledSpinnerWrapper>
  );
};

const mulShdSpin = keyframes`
 to {
  transform: rotate(360deg);
 }
 `;

const StyledSpinner = styled.div`
  width: 6px;
  height: 6px;
  animation: ${mulShdSpin} 1.9s infinite linear;
  border-radius: 6px;
  box-shadow: ${(p) => {
    const radius = 16;
    const sizeDots = 11;
    const shadow: string[] = [`calc(sin(0deg) * ${radius}px) calc(cos(0deg) * ${radius}px) 0 0 #dbe8fb`];
    const corner = 360 / sizeDots;
    for (let i = 1; i <= sizeDots; i++) {
      shadow.push(
        `calc(sin(${corner}deg* ${i}) * ${radius}px) calc(cos(${corner}deg* ${i}) * ${radius}px) 0 0 #a1c2f4`
      );
    }
    return `${shadow.join(",")};`;
  }};
`;

const StyledSpinnerWrapper = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
