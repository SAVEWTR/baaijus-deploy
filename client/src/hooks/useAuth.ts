import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function useAuth() {
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const { data: user, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  useEffect(() => {
    if (isSuccess || isError) {
      setHasInitialized(true);
    }
  }, [isSuccess, isError]);

  return {
    user,
    isLoading: isLoading || !hasInitialized,
    isAuthenticated: !!user,
  };
}
