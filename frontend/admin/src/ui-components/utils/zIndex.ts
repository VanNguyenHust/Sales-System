import { layer } from "./shared";

export function getZIndexForLayerFromNode(node: Element) {
  const layerNode = node.closest(layer.selector) || document.body;
  const zIndex = layerNode === document.body ? "auto" : parseInt(window.getComputedStyle(layerNode).zIndex || "0", 10);
  return zIndex === "auto" || isNaN(zIndex) ? undefined : zIndex;
}
