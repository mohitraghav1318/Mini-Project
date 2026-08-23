"use client";

import { useMemo, useState } from "react";

const MAX_RESULTS = 10;

// Manages search text, dropdown open state, and selection logic
// for the interest picker. Filtering is done here so the component
// stays purely presentational.
export function useInterestSelect(allInterests, selectedIds, onChange) {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Interests matching the search text, excluding ones already selected,
  // capped to the top 10 so the dropdown stays short.
  const filteredResults = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return allInterests
      .filter((interest) => !selectedIds.includes(interest.id))
      .filter((interest) => interest.name.toLowerCase().includes(query))
      .slice(0, MAX_RESULTS);
  }, [allInterests, searchText, selectedIds]);

  // The full interest objects for currently selected ids (used to render tags)
  const selectedInterests = useMemo(
    () => allInterests.filter((interest) => selectedIds.includes(interest.id)),
    [allInterests, selectedIds]
  );

  function selectInterest(interestId) {
  console.log("CLICKED interest:", interestId);
  onChange([...selectedIds, interestId]);
  setSearchText("");
}

  function removeInterest(interestId) {
    onChange(selectedIds.filter((id) => id !== interestId));
  }

  return {
    searchText,
    setSearchText,
    isOpen,
    setIsOpen,
    filteredResults,
    selectedInterests,
    selectInterest,
    removeInterest,
  };
}