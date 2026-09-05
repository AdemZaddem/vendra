"use client";
import { useState } from "react";
import { StepProps, Governorate } from "../types";

const GOVERNORATES: { value: Governorate; label: string }[] = [
  { value: "tunis", label: "Tunis" },
  { value: "ariana", label: "Ariana" },
  { value: "ben_arous", label: "Ben Arous" },
  { value: "manouba", label: "Manouba" },
  { value: "nabeul", label: "Nabeul" },
  { value: "zaghouan", label: "Zaghouan" },
  { value: "bizerte", label: "Bizerte" },
  { value: "beja", label: "Béja" },
  { value: "jendouba", label: "Jendouba" },
  { value: "kef", label: "Le Kef" },
  { value: "siliana", label: "Siliana" },
  { value: "kairouan", label: "Kairouan" },
  { value: "kasserine", label: "Kasserine" },
  { value: "sidi_bouzid", label: "Sidi Bouzid" },
  { value: "sousse", label: "Sousse" },
  { value: "monastir", label: "Monastir" },
  { value: "mahdia", label: "Mahdia" },
  { value: "sfax", label: "Sfax" },
  { value: "gafsa", label: "Gafsa" },
  { value: "tozeur", label: "Tozeur" },
  { value: "kebili", label: "Kébili" },
  { value: "gabes", label: "Gabès" },
  { value: "medenine", label: "Médenine" },
  { value: "tataouine", label: "Tataouine" },
];

const StepDelivery = ({ data, updateData, onNext, onBack }: StepProps) => {
  const [contactPhone, setContactPhone] = useState(data.contactPhone ?? "");
  const [contactEmail, setContactEmail] = useState(data.contactEmail ?? "");
  const [governorates, setGovernorates] = useState<Governorate[]>(
    data.governorates ?? []
  );

  const toggleGovernorate = (value: Governorate) => {
    setGovernorates((prev) =>
      prev.includes(value)
        ? prev.filter((g) => g !== value)
        : [...prev, value]
    );
  };

  const selectAll = () => setGovernorates(GOVERNORATES.map((g) => g.value));
  const clearAll = () => setGovernorates([]);

  const isValid = governorates.length > 0;

  const handleNext = () => {
    updateData({ contactPhone, contactEmail, governorates });
    onNext();
  };

  return (
    <div>
      <div>
        <label htmlFor="contactPhone">Contact phone</label>
        <input
          id="contactPhone"
          type="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="contactEmail">Contact email</label>
        <input
          id="contactEmail"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
      </div>

      <div>
        <p>Which governorates do you deliver to?</p>
        <button type="button" onClick={selectAll}>Select all</button>
        <button type="button" onClick={clearAll}>Clear all</button>

        <div>
          {GOVERNORATES.map((g) => (
            <label key={g.value}>
              <input
                type="checkbox"
                checked={governorates.includes(g.value)}
                onChange={() => toggleGovernorate(g.value)}
              />
              {g.label}
            </label>
          ))}
        </div>
      </div>

      <button onClick={onBack}>Back</button>
      <button onClick={handleNext} disabled={!isValid}>Next</button>
    </div>
  );
};
export default StepDelivery;