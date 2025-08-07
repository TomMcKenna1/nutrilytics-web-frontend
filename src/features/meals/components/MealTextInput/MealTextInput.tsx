import React, { useState, useEffect, useRef } from "react";
import styles from "./MealTextInput.module.css";
import DateTimePicker from "../DateTimePicker/DateTimePicker";
import { useCreateMeal } from "../../../../hooks/useCreateMeal";
import { IoSend } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";

/**
 * A custom hook to detect clicks outside of a specified element.
 */
const useOnClickOutside = (
  ref: React.RefObject<HTMLDivElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

/**
 * A custom hook to create a dynamic "typing" effect for a list of words.
 */
const useTypingEffect = (words: string[]) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeoutId: number;

    if (!isDeleting && text === currentWord) {
      timeoutId = window.setTimeout(() => setIsDeleting(true), 3000);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      const speed = isDeleting ? 50 : 75;
      timeoutId = window.setTimeout(() => {
        const nextText = isDeleting
          ? currentWord.substring(0, text.length - 1)
          : currentWord.substring(0, text.length + 1);
        setText(nextText);
      }, speed);
    }

    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, wordIndex, words]);

  return text;
};

/**
 * Formats a date into a user-friendly string like "Today at 3:30 PM".
 */
const formatMealDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const inputDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  let dayString = "";
  if (inputDate.getTime() === today.getTime()) {
    dayString = "Today";
  } else if (inputDate.getTime() === yesterday.getTime()) {
    dayString = "Yesterday";
  } else {
    dayString = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  const timeString = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${dayString} at ${timeString}`;
};

const placeholderMeals = [
  "A bowl of oatmeal with berries and a drizzle of honey",
  "Two scrambled eggs with spinach and avocado toast",
  "Grilled chicken salad with a light vinaigrette",
  "A hearty beef stew with carrots and potatoes",
];

const MealTextInput = () => {
  const [mealInput, setMealInput] = useState("");
  const [mealDate, setMealDate] = useState(new Date());
  const [isFocused, setIsFocused] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const dynamicPlaceholder = useTypingEffect(placeholderMeals);
  const {
    mutate: createMealMutation,
    isPending: isSubmitting,
    error,
  } = useCreateMeal();

  useOnClickOutside(formRef, () => setDatePickerVisible(false));

  const handleDateChange = (newDate: Date) => {
    setMealDate(newDate);
    setDatePickerVisible(false);
  };

  const handleMealSubmit = () => {
    if (!mealInput.trim() || isSubmitting) return;
    createMealMutation(
      { description: mealInput, date: mealDate },
      {
        onSuccess: () => {
          setMealInput("");
          setMealDate(new Date());
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMealSubmit();
    }
  };

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className={styles.mealFormContainer} ref={formRef}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={mealInput}
          onChange={(e) => setMealInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? "" : `${dynamicPlaceholder}_`}
          className={styles.mealInput}
          disabled={isSubmitting}
        />
        <div className={styles.controlsWrapper}>
          <button
            type="button"
            className={styles.dateButton}
            onClick={() => setDatePickerVisible((v) => !v)}
          >
            <FaRegCalendarAlt />
            <span>{formatMealDate(mealDate)}</span>
          </button>
          <button
            type="button"
            onClick={handleMealSubmit}
            disabled={isSubmitting || !mealInput.trim()}
            className={styles.logButton}
            aria-label="Log Meal"
          >
            <IoSend />
          </button>
        </div>
      </div>

      {isDatePickerVisible && (
        <div className={styles.datePickerPopover}>
          <DateTimePicker
            onChange={handleDateChange}
            initialDateTime={mealDate}
          />
        </div>
      )}

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default MealTextInput;
