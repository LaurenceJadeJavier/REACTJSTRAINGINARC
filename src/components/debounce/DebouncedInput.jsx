import React from "react";

export default function DebounceInput({ onChange, ...props}) {
  const [inputValue, setInputValue] = React.useState("");

  const handleInputChange = (event) => setInputValue(event);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
        onChange(inputValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue, 500]);

  return <input onChange={handleInputChange} {...props} />;
};