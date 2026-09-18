// The signed-in trainer, static for phase 2. Phase 4 replaces this with the
// session and the database and keeps the shape: ids, not counts, so every
// number on screen is derived from data rather than typed in.

export type Trainer = {
  email: string;
  /** Ids the trainer has seen. Rows for anything else render as unseen. */
  seen: number[];
  /** Ids the trainer owns. Owned rows carry a filled Poké Ball. */
  owned: number[];
  /** Ids saved to Favorites, in the order they were saved. */
  favorites: number[];
  /** The last detail screen opened, for the dashboard's third card. */
  lastViewed: number;
};

export const TRAINER: Trainer = {
  email: "ash@pallet.town",
  seen: [1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 92, 93, 94, 143, 150, 151],
  owned: [1, 2, 3, 4, 5, 7, 25, 94, 143],
  favorites: [25, 94, 143],
  lastViewed: 25,
};
