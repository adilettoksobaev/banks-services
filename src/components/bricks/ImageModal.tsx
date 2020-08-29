import React from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { baseUrl } from '../../utils/baseUrl';

type Props = {
    openImage: boolean;
    imageClickClose: (value: boolean) => void;
    sessionId: string | null;
    customerId: number;
    apiKey: string;
    clientInfo?: boolean;
}

const ImageModal:React.FC<Props> = ({ openImage, imageClickClose, sessionId, customerId, apiKey, clientInfo }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const imageSteps = [
    {
        imgPath: `${baseUrl()}api/Moderation/GetUserPhoto/${sessionId && sessionId}/${customerId}/photo/${apiKey}`
    },
    {
      imgPath: `${baseUrl()}api/Moderation/GetUserPhoto/${sessionId && sessionId}/${customerId}/passportFront/${apiKey}`
    },
    {
      imgPath: `${baseUrl()}api/Moderation/GetUserPhoto/${sessionId && sessionId}/${customerId}/passportBack/${apiKey}`
    }
  ];

  const imageStepsClientInfo = [
    {
        imgPath: `${baseUrl()}api/Client/GetUserPhoto/${sessionId && sessionId}/${customerId}/photo/${apiKey}`
    },
    {
      imgPath: `${baseUrl()}api/Client/GetUserPhoto/${sessionId && sessionId}/${customerId}/passportFront/${apiKey}`
    },
    {
      imgPath: `${baseUrl()}api/Client/GetUserPhoto/${sessionId && sessionId}/${customerId}/passportBack/${apiKey}`
    }
  ];

  const maxSteps = imageSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const closeClick = () => {
    imageClickClose(false)
  }

  return (
    <div className={`imageModal ${openImage ? 'show' : 'hidden'}`}>
        <IconButton onClick={closeClick} className="modalClose">
            <CloseIcon />
        </IconButton>
        <div className="imageModal__item">
            {clientInfo ? <img src={imageStepsClientInfo[activeStep].imgPath} alt="" /> : <img src={imageSteps[activeStep].imgPath} alt="" /> }
        </div>
        <MobileStepper
            steps={maxSteps}
            position="bottom"
            variant="dots"
            activeStep={activeStep}
            className="imageModal__stepper"
            nextButton={
                <Button onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                    <KeyboardArrowRight />
                </Button>
            }
            backButton={
                <Button onClick={handleBack} disabled={activeStep === 0}>
                    <KeyboardArrowLeft />
                </Button>
            }
        />
    </div>
  );
}

export default ImageModal;