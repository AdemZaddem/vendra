"use client";
import { useState } from "react";
import { StepProps } from "../types";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

const StepBranding = ({ data, updateData, onNext, onBack }: StepProps) => {
  const [tagline, setTagline] = useState(data.tagline ?? "");
  const [brandColor, setBrandColor] = useState(data.brandColor ?? "#000000");
  const [logoUrl, setLogoUrl] = useState(data.logoUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }

    setError(null);
    setUploading(true);

    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("Logos").upload(fileName, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("Logos").getPublicUrl(fileName);

    setLogoUrl(publicUrlData.publicUrl);
    setUploading(false);
  };

  const handleNext = () => {
    updateData({ tagline, brandColor, logoUrl });
    onNext();
  };

  return (
    <div>
      <div>
        <label htmlFor="logo">Store logo</label>
        <input id="logo" type="file" accept="image/*" onChange={handleFileChange} />
        {uploading && <p>Uploading...</p>}
        {error && <p>{error}</p>}
        {logoUrl && !uploading && <Image src={logoUrl} alt="Logo preview" width={80} height={80} />}
      </div>

      <div>
        <label htmlFor="brandColor">Brand color</label>
        <input
          id="brandColor"
          type="color"
          value={brandColor}
          onChange={(e) => setBrandColor(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="tagline">Tagline (optional)</label>
        <input
          id="tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          maxLength={200}
        />
      </div>

      <button onClick={onBack}>Back</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};
export default StepBranding;
