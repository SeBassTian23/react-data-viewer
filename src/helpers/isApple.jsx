
export function isApple() {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator?.platform || navigator.userAgent)
}