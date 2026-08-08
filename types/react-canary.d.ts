/// <reference types="react/canary" />

// `ViewTransition` ships in the React canary that Next vendors for the App
// Router, but @types/react keeps its declaration behind this reference. A
// `types` array in tsconfig would load it too, at the cost of every other
// ambient package (@types/node included) no longer auto-loading.
