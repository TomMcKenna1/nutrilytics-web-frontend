import React, { useState, useEffect } from "react";
import { useCreateMealDraft } from "../../../../hooks/useCreateMealDraft";
import styles from "./MealTextInput.module.css";

const placeholderMeals = [
  "A bowl of oatmeal with berries and a drizzle of honey",
  "Two scrambled eggs with spinach and a side of avocado toast",
  "Grilled chicken salad with a light vinaigrette",
  "A hearty beef stew with carrots and potatoes",
  "Salmon fillet with roasted asparagus and a lemon wedge",
  "A simple margherita pizza with fresh basil",
];

/**
 * A custom hook to create a dynamic "typing" effect for a list of words.
 * @param words The array of strings to cycle through.
 * @returns The currently displayed text for the placeholder.
 */
const useTypingEffect = (words: string[]) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  // in ms
  const START_DELAY = 1000;
  const END_DELAY = 3000;
  const DELETING_SPEED = 5;
  const TYPING_SPEED = 75;
  const CURSOR_BLINK_INTERVAL = 500;

  useEffect(() => {
    let timeoutId: number;

    if (!isDeleting && text === words[wordIndex]) {
      timeoutId = window.setTimeout(() => setIsDeleting(true), END_DELAY);
    } else if (isDeleting && text === "") {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, START_DELAY);
    } else {
      const delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;
      timeoutId = window.setTimeout(() => {
        const currentWord = words[wordIndex];
        const nextText = isDeleting
          ? currentWord.substring(0, text.length - 1)
          : currentWord.substring(0, text.length + 1);
        setText(nextText);
      }, delay);
    }

    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, wordIndex, words]);

  useEffect(() => {
    const blinker = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, CURSOR_BLINK_INTERVAL);
    return () => clearInterval(blinker);
  }, []);

  return `${text}${showCursor ? "_" : "\u00A0"}`;
};

const MealTextInput = () => {
  const [mealInput, setMealInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dynamicPlaceholder = useTypingEffect(placeholderMeals);
  const {
    mutate: createDraft,
    isPending: isSubmitting,
    error,
  } = useCreateMealDraft();

  const handleMealSubmit = async () => {
    if (!mealInput.trim()) return;

    createDraft(mealInput, {
      onSuccess: () => {
        setMealInput("");
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMealSubmit();
    }
  };

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className={styles.mealForm}>
      <input
        type="text"
        value={mealInput}
        onChange={(e) => setMealInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? "" : dynamicPlaceholder}
        className={styles.mealInput}
        disabled={isSubmitting}
      />
      <button
        onClick={handleMealSubmit}
        disabled={isSubmitting}
        className={styles.mealButton}
      >
        {isSubmitting ? "..." : "Log"}
      </button>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default MealTextInput;
