import { useEffect, useState } from "react";

/**
 * This hook is like React.useState but applies changes after a certain timeout.
 */
export default function useStaging<TValue>(
  initial: TValue,
  timeout = 1000
): [TValue, TValue, (value: TValue) => void] {
  const [value, setValue] = useState<TValue>(initial);
  const [staging, setStaging] = useState<TValue>(initial);
  useEffect(() => {
    const handle = setTimeout(() => setValue(staging), timeout);
    return () => clearTimeout(handle);
  }, [staging]);

  return [value, staging, setStaging];
}
