"use client";

import { useInterests } from "@/hooks/useInterests";
import { useInterestSelect } from "./hooks/useInterestSelect";
import styles from "./InterestSelect.module.scss";

// selectedIds: array of currently chosen interest ids
// onChange: called with the new array whenever selection changes
export default function InterestSelect({ selectedIds, onChange }) {
  const { interests: allInterests, isLoading } = useInterests();
  const {
    searchText,
    setSearchText,
    isOpen,
    setIsOpen,
    filteredResults,
    selectedInterests,
    selectInterest,
    removeInterest,
  } = useInterestSelect(allInterests, selectedIds, onChange);

  return (
    <div className={styles.wrapper}>
      {/* Selected interests shown as removable tags */}
      {selectedInterests.length > 0 && (
        <div className={styles.tags}>
          {selectedInterests.map((interest) => (
            <span key={interest.id} className={styles.tag}>
              {interest.name}
              <button
                type="button"
                className={styles.removeTagBtn}
                onClick={() => removeInterest(interest.id)}
                aria-label={`Remove ${interest.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input that opens the dropdown */}
      <div className={styles.searchBox}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={isLoading ? "Loading interests..." : "Search interests..."}
          value={searchText}
          disabled={isLoading}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchText(e.target.value);
            setIsOpen(true);
          }}
          // Small delay so a click on a dropdown item registers before the blur closes it
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        />

        {isOpen && filteredResults.length > 0 && (
          <ul className={styles.dropdown}>
            {filteredResults.map((interest) => (
              <li key={interest.id}>
                <button
                    type="button"
                    className={styles.dropdownItem}
                    onMouseDown={(e) => {
                      e.preventDefault(); // stops the input from blurring before the click registers
                      selectInterest(interest.id);
                    }}
                    >
                  {interest.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {isOpen && searchText && filteredResults.length === 0 && (
          <div className={styles.noResults}>No matching interests</div>
        )}
      </div>
    </div>
  );
}