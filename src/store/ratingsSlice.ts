import {
  createSlice,
  type PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import type { RootState } from "./store";

export interface Rating {
  bookId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

interface RatingsState {
  ratings: Rating[];
}

const initialState: RatingsState = {
  ratings: [],
};

export const ratingsSlice = createSlice({
  name: "ratings",
  initialState,
  reducers: {
    addRating: (state, action: PayloadAction<Rating>) => {
      state.ratings.push(action.payload);
    },
  },
});

// Export actions
export const { addRating } = ratingsSlice.actions;

// Memoized selectors
const selectRatingsState = (state: RootState) => state.ratings.ratings;

export const selectRatingsByBookId = createSelector(
  [selectRatingsState, (_state: RootState, bookId: string) => bookId],
  (ratings, bookId) => ratings.filter((rating) => rating.bookId === bookId)
);

export const selectAverageRating = createSelector(
  [selectRatingsByBookId],
  (bookRatings) => {
    if (bookRatings.length === 0) return 0;
    const sum = bookRatings.reduce((total, rating) => total + rating.rating, 0);
    return sum / bookRatings.length;
  }
);

export default ratingsSlice.reducer;
