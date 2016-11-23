export function shrink(item) {
  return item.replace(/\s/g, '');
}

export function nlToSpace(item) {
  return item.trim().replace(/\s+/g, ' ');
}

export function frontTrim(item) {
  return item.replace(/^\s+/, '');
}
