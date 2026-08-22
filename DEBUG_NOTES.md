# InterestSelect debug notes

## What is actually happening

The four live files form a complete, correct selection path:

1. `useEditProfileForm` creates `formValues.interestIds` from `user.interests` at `useEditProfileForm.js:13`.
2. `EditProfileForm` passes that array as `selectedIds` at `EditProfileForm.jsx:42` and passes an `onChange` callback at line 43.
3. `InterestSelect` receives both props and forwards both to `useInterestSelect` at `InterestSelect.jsx:20`.
4. Clicking a result calls `selectInterest(interest.id)` at `InterestSelect.jsx:64`.
5. `selectInterest` calls `onChange([...selectedIds, interestId])` at `useInterestSelect.js:31`.
6. The callback calls `handleChange("interestIds", newIds)`, which updates `formValues` with `setFormValues` at `useEditProfileForm.js:19`.
7. React re-renders `EditProfileForm` and `InterestSelect`; the selected id is then excluded from the results at `useInterestSelect.js:19` and rendered as a tag at `InterestSelect.jsx:25-40`.

So, for one normal click, `formValues.interestIds` **does update**. `onChange` is passed correctly at every layer. The current source has no broken line that can make a typed query always remain unfiltered or make one clicked result fail to become a tag.

`filteredResults` is also correct. At `useInterestSelect.js:17-21`, it converts the entered text to lowercase and uses `name.includes(query)`. It returns all ten items only when `searchText` is empty (because every string includes `""`). For example, typing `book` should leave only `Bookkeeping`.

Therefore, if all ten items remain after visible typing, the runtime value passed to `setSearchText` is not the text being typed, or the browser is not executing this exact file. If a click produces no tag, the most direct runtime check is whether the callbacks below fire and whether `newIds` is received by `EditProfileForm`.

## Exactly which file and line is broken

There is **no broken line in the four files currently on disk** that accounts for the reported single-selection failure. The relevant lines are wired correctly:

- `InterestSelect.jsx:52-55` updates search state from the input event.
- `useInterestSelect.js:16-22` filters against that state.
- `InterestSelect.jsx:64` calls `selectInterest` with the clicked id.
- `useInterestSelect.js:30-33` invokes the passed `onChange`.
- `EditProfileForm.jsx:43` forwards that value to `handleChange`.
- `useEditProfileForm.js:18-20` updates form state.

The only state-safety weakness is `useInterestSelect.js:31`: it calculates the next ids from the `selectedIds` captured by the current render. This can lose an earlier selection when two items are clicked before React processes a re-render. It does **not** prevent a single item from being selected.

## Minimal code fix

No code change is justified for the reported single-selection failure from these files alone. First confirm the live event/state trace. Temporary logs (do not commit) would be:

```diff
// InterestSelect.jsx, inside the input onChange (before setSearchText)
+ console.log("interest search input", e.target.value);

// useInterestSelect.js, immediately before `return allInterests`
+ console.log("interest filter", { searchText, query, selectedIds });

// useInterestSelect.js, first line of selectInterest
+ console.log("interest selected", { interestId, selectedIds, nextIds: [...selectedIds, interestId] });

// EditProfileForm.jsx, inside onChange
- onChange={(newIds) => handleChange("interestIds", newIds)}
+ onChange={(newIds) => {
+   console.log("interest ids received by form", newIds);
+   handleChange("interestIds", newIds);
+ }}

// useEditProfileForm.js, inside the setFormValues updater
- setFormValues((prev) => ({ ...prev, [fieldName]: value }));
+ setFormValues((prev) => {
+   const next = { ...prev, [fieldName]: value };
+   console.log("form values updated", next);
+   return next;
+ });
```

Expected for selecting `Bookkeeping` (id `9`):

1. `interest search input` logs the typed text, e.g. `book`.
2. `interest filter` logs `query: "book"` and one result is rendered.
3. `interest selected` logs `interestId: 9` and `nextIds` containing `9`.
4. `interest ids received by form` logs the same array.
5. `form values updated` logs `interestIds` with `9`.

If step 1 does not log, the browser is not using this `InterestSelect.jsx` (or another element is receiving input). If step 1 logs but step 2 shows an empty `searchText`, state is being reset outside these four files. If steps 1-3 log but step 4 does not, the rendered component differs from this source. If step 5 logs the id but no tag appears, inspect the actual values and types of `allInterests[*].id` and `formValues.interestIds` at render time.

For the separate rapid-click stale-state weakness at `useInterestSelect.js:31`, the minimal reliable correction requires moving the append into a functional `setFormValues` update in `useEditProfileForm`; do not apply that change until it is needed, because it changes the `onChange` contract.
