import { useState } from "react";
import Entirespace1 from "./Entirespaces/Entirespace1";
import Entirespace2 from "./Entirespaces/Entirespace2";
import Entirespace3 from "./Entirespaces/Entirespace3";
import Entirespace4 from "./Entirespaces/Entirespace4";

const Entirespace = () => {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => Math.max(1, prev - 1));

  return (
    <>
      {step === 1 && <Entirespace1 onNext={goNext} />}
      {step === 2 && <Entirespace2 onNext={goNext} onBack={goBack} />}
      {step === 3 && <Entirespace3 onNext={goNext} onBack={goBack} />}
      {step === 4 && <Entirespace4 onBack={goBack} />}
    </>
  );
};

export default Entirespace;
