const REGISTRY = {};

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
