import { createContext, useContext } from "react";
import { debounce } from "lodash-es";

import { dataUITopBar } from "../../utils/shared";

import { Rect } from "./Rect";

interface StickyItem {
  /** Node of the sticky element */
  stickyNode: HTMLElement;
  /** Placeholder element */
  placeHolderNode: HTMLElement;
  /** Element outlining the fixed position boundaries */
  boundingElement?: HTMLElement | null;
  /** Offset vertical spacing from the top of the scrollable container */
  offset: boolean;
  /** Should the element remain in a fixed position when the layout is stacked (smaller screens)  */
  disableWhenStacked: boolean;
  /** Method to handle positioning */
  handlePositioning(stick: boolean, top?: number, left?: number, width?: string | number): void;
}

const SIXTY_FPS = 1000 / 60;

export class StickyManager {
  private stickyItems: StickyItem[] = [];
  private stuckItems: StickyItem[] = [];
  private container: Document | HTMLElement | null = null;
  private topBarOffset = 0;

  private handleResize = debounce(
    () => {
      this.manageStickyItems();
    },
    SIXTY_FPS,
    { leading: true, trailing: true, maxWait: SIXTY_FPS }
  );

  private handleScroll = debounce(
    () => {
      this.manageStickyItems();
    },
    SIXTY_FPS,
    { leading: true, trailing: true, maxWait: SIXTY_FPS }
  );

  constructor(container?: Document | HTMLElement) {
    if (container) {
      this.setContainer(container);
    }
  }

  registerStickyItem(stickyItem: StickyItem): void {
    this.stickyItems.push(stickyItem);
    this.manageStickyItems();
  }

  unregisterStickyItem(nodeToRemove: HTMLElement) {
    const nodeIndex = this.stickyItems.findIndex(({ stickyNode }) => nodeToRemove === stickyNode);
    this.stickyItems.splice(nodeIndex, 1);
  }

  getStickyItem(node: HTMLElement) {
    return this.stickyItems.find(({ stickyNode }) => node === stickyNode);
  }

  setContainer(el: Document | HTMLElement) {
    this.container = el;
    if (isDocument(el)) {
      this.setTopBarOffset(el);
    }
    this.container.addEventListener("scroll", this.handleScroll, {
      passive: true,
    });
    window.addEventListener("resize", this.handleResize);
    this.manageStickyItems();
  }

  removeScrollListener() {
    if (this.container) {
      this.container.removeEventListener("scroll", this.handleScroll);
      window.removeEventListener("resize", this.handleResize);
    }
  }

  private manageStickyItems() {
    if (this.stickyItems.length <= 0) {
      return;
    }

    const scrollTop = this.container ? scrollTopFor(this.container) : 0;
    const containerTop = getRectForNode(this.container).top + this.topBarOffset;

    this.stickyItems.forEach((stickyItem) => {
      const { handlePositioning } = stickyItem;

      const { sticky, top, left, width } = this.evaluateStickyItem(stickyItem, scrollTop, containerTop);

      this.updateStuckItems(stickyItem, sticky);

      handlePositioning(sticky, top, left, width);
    });
  }

  private evaluateStickyItem(
    stickyItem: StickyItem,
    scrollTop: number,
    containerTop: number
  ): {
    sticky: boolean;
    top: number;
    left: number;
    width: string | number;
  } {
    const { stickyNode, placeHolderNode, boundingElement, offset, disableWhenStacked } = stickyItem;

    if (disableWhenStacked && stackedContent().matches) {
      return {
        sticky: false,
        top: 0,
        left: 0,
        width: "auto",
      };
    }

    const stickyOffset = offset ? this.getOffset(stickyNode) + parseInt("1.25rem", 10) : this.getOffset(stickyNode);

    const scrollPosition = scrollTop + stickyOffset;
    const placeHolderNodeCurrentTop = placeHolderNode.getBoundingClientRect().top - containerTop + scrollTop;
    const top = containerTop + stickyOffset;
    const width = placeHolderNode.getBoundingClientRect().width;
    const left = placeHolderNode.getBoundingClientRect().left;

    let sticky: boolean;

    if (!boundingElement) {
      sticky = scrollPosition >= placeHolderNodeCurrentTop;
    } else {
      const stickyItemHeight =
        stickyNode.getBoundingClientRect().height || stickyNode.firstElementChild?.getBoundingClientRect().height || 0;
      const stickyItemBottomPosition =
        boundingElement.getBoundingClientRect().bottom - stickyItemHeight + scrollTop - containerTop;

      sticky = scrollPosition >= placeHolderNodeCurrentTop && scrollPosition < stickyItemBottomPosition;
    }

    return {
      sticky,
      top,
      left,
      width,
    };
  }

  private updateStuckItems(item: StickyItem, sticky: boolean) {
    const { stickyNode } = item;
    if (sticky && !this.isNodeStuck(stickyNode)) {
      this.addStuckItem(item);
    } else if (!sticky && this.isNodeStuck(stickyNode)) {
      this.removeStuckItem(item);
    }
  }

  private addStuckItem(stickyItem: StickyItem) {
    this.stuckItems.push(stickyItem);
  }

  private removeStuckItem(stickyItem: StickyItem) {
    const { stickyNode: nodeToRemove } = stickyItem;
    const nodeIndex = this.stuckItems.findIndex(({ stickyNode }) => nodeToRemove === stickyNode);
    this.stuckItems.splice(nodeIndex, 1);
  }

  private getOffset(node: HTMLElement) {
    if (this.stuckItems.length === 0) {
      return 0;
    }

    let offset = 0;
    let count = 0;
    const stuckNodesLength = this.stuckItems.length;
    const nodeRect = getRectForNode(node);

    while (count < stuckNodesLength) {
      const stuckNode = this.stuckItems[count].stickyNode;
      if (stuckNode !== node) {
        const stuckNodeRect = getRectForNode(stuckNode);
        if (!horizontallyOverlaps(nodeRect, stuckNodeRect)) {
          offset += getRectForNode(stuckNode).height;
        }
      } else {
        break;
      }
      count++;
    }

    return offset;
  }

  private isNodeStuck(node: HTMLElement): boolean {
    const nodeFound = this.stuckItems.findIndex(({ stickyNode }) => node === stickyNode);

    return nodeFound >= 0;
  }

  private setTopBarOffset(container: Document) {
    const topbarElement = container.querySelector(`${dataUITopBar.selector}`);
    this.topBarOffset = topbarElement ? topbarElement.clientHeight : 0;
  }
}

function isDocument(node: HTMLElement | Document): node is Document {
  return node === document;
}

function scrollTopFor(container: HTMLElement | Document) {
  return isDocument(container) ? document.body.scrollTop || document.documentElement.scrollTop : container.scrollTop;
}

function horizontallyOverlaps(rect1: Rect, rect2: Rect) {
  const rect1Left = rect1.left;
  const rect1Right = rect1.left + rect1.width;
  const rect2Left = rect2.left;
  const rect2Right = rect2.left + rect2.width;

  return rect2Right < rect1Left || rect1Right < rect2Left;
}
export function getRectForNode(node: Element | React.ReactNode | Window | Document): Rect {
  if (!(node instanceof Element)) {
    return new Rect({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  const rect = node.getBoundingClientRect();

  return new Rect({
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  });
}
const noWindowMatches: MediaQueryList = {
  media: "",
  addListener: noop,
  removeListener: noop,
  matches: false,
  onchange: noop,
  addEventListener: noop,
  removeEventListener: noop,
  dispatchEvent: () => true,
};
const Breakpoints = {
  // TODO: Update to smDown
  navigationBarCollapsed: "767.95px",
  // TODO: Update to lgDown
  stackedContent: "1039.95px",
};
export function stackedContent() {
  return typeof window === "undefined"
    ? noWindowMatches
    : window.matchMedia(`(max-width: ${Breakpoints.stackedContent})`);
}
function noop() {}
export const StickyManagerContext = createContext<StickyManager | undefined>(undefined);
export function useStickyManager() {
  const stickyManager = useContext(StickyManagerContext);

  if (!stickyManager) {
    throw new Error(
      "No Frame context was provided. Your component must be wrapped in a <StickyManagerContext > component"
    );
  }

  return stickyManager;
}

export const StickyContext = createContext<boolean | undefined>(undefined);
