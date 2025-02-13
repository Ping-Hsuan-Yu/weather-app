"use client"

import { useWeatherContext } from "@/context/WeatherContext";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export default function ShaderGradientBG() {
  const { isDarkMode } = useWeatherContext();

  return (
    <ShaderGradientCanvas
      style={{
        position: "absolute",
        top: 0,
      }}
      pointerEvents="none"
      pixelDensity={2}
    >
      {isDarkMode ? (
        <ShaderGradient
          control="props"
          type="plane"
          shader="A"
          uStrength={2}
          uDensity={1}
          color1="#155e75"
          color2="#075985"
          color3="#d1d5db"
          grain="on"
          brightness={1.2}
          animate="on"
          uSpeed={0.3}
          cDistance={4.5}
          cAzimuthAngle={170}
          cPolarAngle={50}
        />
      ) : (
        <ShaderGradient
          control="props"
          type="waterPlane"
          shader="A"
          uStrength={2}
          uDensity={1}
          color1="#7dd3fc"
          color2="#22d3ee"
          color3="#ecfeff"
          grain="off"
          brightness={1.2}
          animate="on"
          uSpeed={0.3}
          cDistance={4.5}
        />
      )}
    </ShaderGradientCanvas>
  );
}
