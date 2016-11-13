export function shrink(item) {
  return item.replace(/\s/g, '').replace(/;$/, '');
}

export function nlToSpace(item) {
  return item.trim().replace(/\s+/g, ' ').replace(/;$/, '');
}

export function frontTrim(item) {
  return item.replace(/^\s+/, '');
}
