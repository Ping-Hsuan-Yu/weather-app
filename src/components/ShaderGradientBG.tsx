import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { useWeatherContext } from "../contexts/WeatherContext";

export default function ShaderGradientBG() {
  const { isDarkMode } = useWeatherContext();

  return (
    <ShaderGradientCanvas
      style={{
        position: "absolute",
        top: 0,
      }}
    >
      {isDarkMode ? (
        <ShaderGradient
        control="props"
        type="waterPlane"
        shader="A"
        uStrength={3.4}
        uDensity={1.2}
        grain="off"
        reflection={0.1}
        color1="#5929c1"
        color2="#2b65bb"
        color3="#0b19b8"
        animate="on"
        uSpeed={0.2}
        cDistance={8}
        />
      ) : (
        <ShaderGradient
        control="props"
        type="waterPlane"
        shader="A"
        uStrength={3.4}
        uDensity={1.2}
        grain="off"
        reflection={0.1}
        color1="#ffefea"
        color2="#ffc187"
        color3="#96cafe"
        envPreset="lobby"
        animate="on"
        uSpeed={0.2}
        />
      )}
    </ShaderGradientCanvas>
  );
}
