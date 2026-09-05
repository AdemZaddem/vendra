"use client";
import { useState } from "react";
import Image from "next/image";
import { StepProps } from "../types";

const THEMES = [
  { id: "classic", name: "Classic", previewUrl: "/themes/classic-preview.png" },
];

const StepTheme = ({ data, updateData, onNext, onBack }: StepProps) => {
  const [themeId, setThemeId] = useState(data.themeId ?? THEMES[0].id);

  const handleNext = () => {
    updateData({ themeId });
    onNext();
  };

  return (
    <div>
      <p>Choose a storefront theme</p>
      <div>
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setThemeId(theme.id)}
            style={{
              border: themeId === theme.id ? "2px solid blue" : "1px solid gray",
            }}
          >
            <Image
              src={theme.previewUrl}
              alt={theme.name}
              width={150}
              height={100}
            />
            <p>{theme.name}</p>
          </button>
        ))}
      </div>
      <button onClick={onBack}>Back</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};
export default StepTheme;