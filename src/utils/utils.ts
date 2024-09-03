export const createElementFromHTML = (htmlString: string): HTMLElement => {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div;
};

export const getSelectedWord = (e: React.MouseEvent<HTMLDivElement>) => {
  const selectedLine = (e.target as HTMLElement).textContent;
  const selectedData = window.getSelection();
  const selectedContent = selectedLine?.slice(
    selectedData?.anchorOffset,
    selectedData?.focusOffset
  );
  return selectedContent;
};
