import styled from "@emotion/styled";

export type ProgressStep = {
  step: number;
  label: string;
};

type Props = {
  activeStep: number;
  steps: ProgressStep[];
};
export const ProgressSteps = ({ activeStep, steps }: Props) => {
  const totalSteps = steps.length;

  const widthActive = `${(100 / (totalSteps - 1)) * ((activeStep >= totalSteps ? totalSteps : activeStep) - 1)}%`;

  const width = `${40 * (totalSteps - 1)}%`;

  return (
    <MainContainer accessKey={width}>
      <StepContainer accessKey={widthActive}>
        {steps.map(({ step, label }) => (
          <StepWrapper key={step}>
            <StepStyle
              accessKey={activeStep >= step ? "completed" : "incomplete"}
              itemType={activeStep === step ? "active" : "inactive"}
            >
              <StepCount accessKey={activeStep >= step ? "completed" : "incomplete"}>
                {activeStep > step ? <CheckMark>L</CheckMark> : step}
              </StepCount>
            </StepStyle>
            <StepsLabelContainer>
              <StepLabel key={step} accessKey={activeStep >= step ? "completed" : "incomplete"}>
                <p>{label}</p>
              </StepLabel>
            </StepsLabelContainer>
          </StepWrapper>
        ))}
      </StepContainer>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  width: 90%;
  max-width: ${(p) => p.accessKey};
  margin: 0 5%;
  padding: 0 6px;
`;

const StepContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  :before {
    content: "";
    position: absolute;
    background: #d3d5d7;
    height: 2px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }
  :after {
    content: "";
    position: absolute;
    background: #0088ff;
    height: 2px;
    width: ${(p) => p.accessKey};
    top: 50%;
    transition: 0.4s ease;
    transform: translateY(-50%);
    left: 0;
  }
`;

const StepWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const StepStyle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${(p) => (p.accessKey === "completed" && p.itemType === "active" ? "#E6F4FF" : "#fff")};
  border: 4px solid #fff;
  transition: 0.4s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 36px;
`;

const StepCount = styled.span`
  font-size: 16px;
  color: ${(p) => (p.accessKey === "completed" ? "#fff" : "#D3D5D7")};
  background-color: ${(p) => (p.accessKey === "completed" ? "#0088ff" : "#fff")};
  border: ${(p) => (p.accessKey === "completed" ? "none" : "2px solid #D3D5D7")};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  line-height: ${(p) => (p.accessKey === "completed" ? "20px" : "14.5px")};
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const StepsLabelContainer = styled.div`
  position: absolute;
  top: 48px;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StepLabel = styled.div`
  width: max-content;
  font-size: 14px;
  color: ${(p) => (p.accessKey === "completed" ? "#0F1824" : "#747C87")};
`;

const CheckMark = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  -ms-transform: scaleX(-1) rotate(-46deg); /* IE 9 */
  -webkit-transform: scaleX(-1) rotate(-46deg); /* Chrome, Safari, Opera */
  transform: scaleX(-1) rotate(-46deg);
`;
