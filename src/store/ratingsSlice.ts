import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

// Selectors - now using a more generic approach
export const selectRatingsByBookId = (
  state: { ratings: RatingsState },
  bookId: string
) => state.ratings.ratings.filter((rating) => rating.bookId === bookId);

export const selectAverageRating = (
  state: { ratings: RatingsState },
  bookId: string
) => {
  const bookRatings = selectRatingsByBookId(state, bookId);
  if (bookRatings.length === 0) return 0;

  const sum = bookRatings.reduce((total, rating) => total + rating.rating, 0);
  return sum / bookRatings.length;
};

export default ratingsSlice.reducer;
