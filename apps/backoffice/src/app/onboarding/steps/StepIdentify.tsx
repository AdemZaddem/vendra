"use client";
import { useState, useEffect } from "react";
import { StepProps } from "../types";

const CATEGORIES = [
  "Women's clothing",
  "Men's clothing",
  "Kids' clothing",
  "Shoes & footwear",
  "Bags & accessories",
  "Jewelry",
  "Beauty & cosmetics",
  "Other",
];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const StepIdentity = ({ data, updateData, onNext }: StepProps) => {
  const [name, setName] = useState(data.name ?? "");
  const [slug, setSlug] = useState(data.slug ?? "");
  const [category, setCategory] = useState(data.category ?? "");
  const [customCategory, setCustomCategory] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  useEffect(() => {
    if (!slug) {
      setSlugAvailable(null);
      return;
    }
    setCheckingSlug(true);
    const timeout = setTimeout(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/organizations/check-slug?slug=${encodeURIComponent(slug)}`
      );
      const { available } = await res.json();
      setSlugAvailable(available);
      setCheckingSlug(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [slug]);

  const finalCategory = category === "Other" ? customCategory : category;
  const isValid = name.trim() && slug.trim() && slugAvailable === true && finalCategory.trim();

  const handleNext = () => {
    updateData({ name, slug, category: finalCategory });
    onNext();
  };

  return (
    <div>
      <div>
        <label htmlFor="name">Store name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="slug">Store URL</label>
        <input
          id="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
        />
        <p>vendra.tn/{slug || "your-store"}</p>
        {checkingSlug && <p>Checking availability...</p>}
        {!checkingSlug && slugAvailable === true && <p>Available</p>}
        {!checkingSlug && slugAvailable === false && <p>This slug is already taken</p>}
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {category === "Other" && (
          <input
            placeholder="Tell us your category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}
      </div>

      <button onClick={handleNext} disabled={!isValid}>
        Next
      </button>
    </div>
  );
};
export default StepIdentity;