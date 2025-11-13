export function calculateElementWidth(
  element: HTMLElement,
  includeMargin: boolean = false
): number {
  const style = window.getComputedStyle(element);
  const width = element.offsetWidth;
  let margin = 0,
    padding = 0;
  if (includeMargin) {
    margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  }
  const border =
    parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

  return width + margin - padding + border;
}

export function calculateElementHeight(
  element: HTMLElement,
  includeMargin: boolean = false
): number {
  const style = window.getComputedStyle(element);
  const height = element.offsetHeight;
  let margin = 0,
    padding = 0;
  if (includeMargin) {
    margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  }
  const border =
    parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

  return height + margin - padding + border;
}

export function calculateScrollPercentage(element: HTMLElement): number {
  const elementScrollTop = element.scrollTop;
  const bodyScrollTop = document.body.scrollTop;
  const elementScrollHeight = element.scrollHeight;
  const bodyScrollHeight = document.body.scrollHeight;
  const elementClientHeight = element.clientHeight;

  const scrollTop = elementScrollTop || bodyScrollTop;
  const scrollHeight = elementScrollHeight || bodyScrollHeight;

  const scrollPercentage =
    (scrollTop / (scrollHeight - elementClientHeight)) * 100;

  return scrollPercentage;
}
