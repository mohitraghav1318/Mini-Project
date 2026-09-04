"use client";

import styles from "./SearchableSelect.module.scss";
import { useSearchableSelect } from "./useSearchableSelect";

export default function SearchableSelect({
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  error,
  required = false,
  disabled = false,
}) {
  const {
    isOpen,
    searchQuery,
    setSearchQuery,
    highlightedIndex,
    setHighlightedIndex,
    filteredOptions,
    selectedOption,
    containerRef,
    inputRef,
    handleSelect,
    handleToggle,
    handleKeyDown,
  } = useSearchableSelect({ options, value, onChange, disabled });

  const selectId = `select-${name}`;
  const listboxId = `listbox-${name}`;
  const errorId = `${name}-error`;

  return (
    <div className={styles.field} ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <div
        id={selectId}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`${styles.selectTrigger} ${isOpen ? styles.open : ""} ${
          error ? styles.inputError : ""
        } ${disabled ? styles.disabled : ""}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span className={selectedOption ? styles.valueText : styles.placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
          ▼
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchBox}>
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label={`Search ${label || name}`}
            />
          </div>

          <ul id={listboxId} role="listbox" className={styles.optionsList}>
            {filteredOptions.length === 0 ? (
              <li className={styles.noOptions}>No options found</li>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.value === value;
                const isHighlighted = index === highlightedIndex;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    className={`${styles.optionItem} ${
                      isSelected ? styles.selected : ""
                    } ${isHighlighted ? styles.highlighted : ""}`}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {opt.label}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {error && (
        <span id={errorId} className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  );
}
