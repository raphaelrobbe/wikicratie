// A custom hook that builds on useLocation to parse

import { useMemo } from "react";
import { useLocation } from "react-router";

// the query string for you.
export const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};
