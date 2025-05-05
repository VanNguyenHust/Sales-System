import React from "react";

import { getRectForNode, StickyContext, useStickyManager } from "./StickyContextManager";

export type StickyProps = {
  /** Element outlining the fixed position boundaries */
  boundingElement?: HTMLElement | null;
  /** Offset vertical spacing from the top of the scrollable container */
  offset?: boolean;
  /** Should the element remain in a fixed position when the layout is stacked (smaller screens)  */
  disableWhenStacked?: boolean;
  children: React.ReactNode | ((isSticky: boolean) => React.ReactNode);
  /** Callback run when sticky header is added or removed  */
  onStickyChange?: (isSticky: boolean) => void;
};

interface State {
  isSticky: boolean;
  style: { [key: string]: unknown };
}

type CombinedProps = StickyProps & {
  stickyManager: ReturnType<typeof useStickyManager>;
};

class StickyInner extends React.Component<CombinedProps, State> {
  state: State = {
    isSticky: false,
    style: {},
  };

  private placeHolderNode: HTMLElement | null = null;
  private stickyNode: HTMLElement | null = null;

  componentDidMount() {
    const { boundingElement, offset = false, disableWhenStacked = false, stickyManager } = this.props;

    if (!this.stickyNode || !this.placeHolderNode) {
      return;
    }

    stickyManager.registerStickyItem({
      stickyNode: this.stickyNode,
      placeHolderNode: this.placeHolderNode,
      handlePositioning: this.handlePositioning,
      offset,
      boundingElement,
      disableWhenStacked,
    });
  }

  componentDidUpdate() {
    const { boundingElement, offset = false, disableWhenStacked = false, stickyManager } = this.props;

    if (!this.stickyNode || !this.placeHolderNode) return;

    const stickyManagerItem = stickyManager.getStickyItem(this.stickyNode);
    const didPropsChange =
      !stickyManagerItem ||
      boundingElement !== stickyManagerItem.boundingElement ||
      offset !== stickyManagerItem.offset ||
      disableWhenStacked !== stickyManagerItem.disableWhenStacked;

    if (!didPropsChange) return;

    stickyManager.unregisterStickyItem(this.stickyNode);
    stickyManager.registerStickyItem({
      stickyNode: this.stickyNode,
      placeHolderNode: this.placeHolderNode,
      handlePositioning: this.handlePositioning,
      offset,
      boundingElement,
      disableWhenStacked,
    });
  }

  componentWillUnmount() {
    const { stickyManager } = this.props;
    if (!this.stickyNode) {
      return;
    }
    stickyManager.unregisterStickyItem(this.stickyNode);
  }

  render() {
    const { style, isSticky } = this.state;
    const { children } = this.props;

    const childrenContent = isFunction(children) ? children(isSticky) : children;

    return (
      <div>
        <div ref={this.setPlaceHolderNode} />
        <div ref={this.setStickyNode} style={style}>
          <StickyContext.Provider value={isSticky}>{childrenContent}</StickyContext.Provider>
        </div>
      </div>
    );
  }

  private setPlaceHolderNode = (node: HTMLElement | null) => {
    this.placeHolderNode = node;
  };

  private setStickyNode = (node: HTMLElement | null) => {
    this.stickyNode = node;
  };

  private handlePositioning = (stick: boolean, top = 0, left = 0, width = 0) => {
    const { isSticky } = this.state;

    if ((stick && !isSticky) || (!stick && isSticky)) {
      this.adjustPlaceHolderNode(stick);
      this.setState({ isSticky: !isSticky }, () => {
        if (!this.props.onStickyChange) {
          return null;
        }

        this.props.onStickyChange(!isSticky);

        if (!this.props.boundingElement) {
          return null;
        }
        this.props.boundingElement.toggleAttribute("data-sticky-active");
      });
    }

    const style = stick
      ? {
          position: "fixed",
          top,
          left,
          width,
        }
      : {};

    this.setState({ style });
  };

  private adjustPlaceHolderNode = (add: boolean) => {
    if (this.placeHolderNode && this.stickyNode) {
      this.placeHolderNode.style.paddingBottom = add ? `${getRectForNode(this.stickyNode).height}px` : "0px";
    }
  };
}

export function Sticky(props: StickyProps) {
  const stickyManager = useStickyManager();

  return <StickyInner {...props} stickyManager={stickyManager} />;
}

// This should have a typeguard instead of using Function
// eslint-disable-next-line @typescript-eslint/ban-types
function isFunction(arg: any): arg is Function {
  return typeof arg === "function";
}
