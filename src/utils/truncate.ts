/**
 * truncates a string at a given length.
 * if you select useWordBoundary, it will only
 * truncate at whole words
 */
const truncateString = (
  str: string,
  length: number,
  useWordBoundary = true
) => {
  // if the string is empty, just return it
  if (str === "") return str;

  if (str.length < length) return str;
  const substring = str.substring(0, length);
  const finalTruncation = useWordBoundary
    ? substring.substring(0, substring.lastIndexOf(" "))
    : substring;

  // ignore word boundary setting if the string ends up empty
  if (finalTruncation === "") return truncateString(str, length, false);

  return finalTruncation + "...";
};

export default truncateString;
