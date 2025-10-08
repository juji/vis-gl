"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export interface AutocompleteOption {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface AutocompleteProps {
  placeholder?: string;
  fetchData: (query: string) => Promise<AutocompleteOption[]>;
  onSelect?: (option: AutocompleteOption) => void;
  debounceMs?: number;
  minChars?: number;
  maxResults?: number;
  className?: string;
  disabled?: boolean;
  clearOnSelect?: boolean;
}

export default function Autocomplete({
  placeholder = "Search...",
  fetchData,
  onSelect,
  debounceMs = 300,
  minChars = 2,
  maxResults = 10,
  className = "",
  disabled = false,
  clearOnSelect = false,
}: AutocompleteProps) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] =
    useState<AutocompleteOption | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchData = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minChars) {
        setOptions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await fetchData(searchQuery);
        const limitedResults = results.slice(0, maxResults);
        setOptions(limitedResults);
        setIsOpen(limitedResults.length > 0);
        setHighlightedIndex(-1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setOptions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchData, minChars, maxResults],
  );

  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        searchData(searchQuery);
      }, debounceMs);
    },
    [searchData, debounceMs],
  );

  useEffect(() => {
    // Don't search if the current query matches the selected option's label
    if (selectedOption && query === selectedOption.label) {
      return;
    }

    if (query.trim()) {
      debouncedSearch(query.trim());
    } else {
      setOptions([]);
      setIsOpen(false);
      setIsLoading(false);
      setSelectedOption(null);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debouncedSearch, selectedOption]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);

    // Clear selected option if user starts typing again
    if (selectedOption && newValue !== selectedOption.label) {
      setSelectedOption(null);
    }
  };

  const handleOptionSelect = (option: AutocompleteOption) => {
    if (clearOnSelect) {
      setQuery("");
      setSelectedOption(null);
    } else {
      setQuery(option.label);
      setSelectedOption(option);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelect?.(option);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : options.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && options[highlightedIndex]) {
          handleOptionSelect(options[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputFocus = () => {
    if (options.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = (_e: React.FocusEvent<HTMLInputElement>) => {
    // Delay hiding to allow option clicks to register
    setTimeout(() => {
      if (!listRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }, 150);
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={`${styles.autocomplete} ${className}`}>
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.input} ${isLoading ? styles.loading : ""} ${error ? styles.error : ""}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />

        {isLoading && (
          <div className={styles.spinner}>
            <div className={styles.spinnerIcon}></div>
          </div>
        )}

        {error && <div className={styles.errorIcon}>⚠️</div>}
      </div>

      {isOpen && (
        <div ref={listRef} className={styles.optionsList} role="listbox">
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`${styles.option} ${
                index === highlightedIndex ? styles.highlighted : ""
              }`}
              onClick={() => handleOptionSelect(option)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOptionSelect(option);
                }
              }}
              role="option"
              aria-selected={index === highlightedIndex}
              tabIndex={0}
            >
              <div className={styles.optionLabel}>{option.label}</div>
              {option.description && (
                <div className={styles.optionDescription}>
                  {option.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}
