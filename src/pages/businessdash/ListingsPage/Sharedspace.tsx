import { useState } from "react";
import Sharedspace1 from "./Sharedspaces/Sharedspace1";
import Sharedspace2 from "./Sharedspaces/Sharedspace2"
import Sharedspace3 from "./Sharedspaces/Sharedspace3";
import Sharedspace4 from "./Sharedspaces/Sharedspace4";

const Sharedspace = () => {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => Math.max(1, prev - 1));

  return (
    <>
      {step === 1 && <Sharedspace1 onNext={goNext} />}
      {step === 2 && <Sharedspace2 onNext={goNext} onBack={goBack} />}
      {step === 3 && <Sharedspace3 onNext={goNext} onBack={goBack} />}
      {step === 4 && <Sharedspace4 onBack={goBack} />}
    </>
  );
};

export default Sharedspace;
