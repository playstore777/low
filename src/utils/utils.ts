export const createElementFromHTML = (htmlString: string) => {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div;
};
