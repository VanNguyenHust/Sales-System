import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { debounce } from "lodash-es";

import { scrollable } from "../../utils/shared";
import { useUniqueId } from "../../utils/uniqueId";
import { useEventListener } from "../../utils/useEventListener";
import { useToggle } from "../../utils/useToggle";
import { useComboboxListbox } from "../Combobox/context";

import { Action } from "./Action";
import { ListboxContext, ListboxContextType, NavigableOption } from "./context";
import { Header } from "./Header";
import { Loading } from "./Loading";
import { Option } from "./Option";
import { Section } from "./Section";
import { TextOption } from "./TextOption";
import { scrollOptionIntoView } from "./util";

export enum AutoSelection {
  /** Default active option is the first selected option. If no options are selected, defaults to first interactive option. */
  FirstSelected = "FIRST_SELECTED",
  /** Default active option is always the first interactive option. */
  First = "FIRST",
  /** Default to the manual selection pattern. */
  None = "NONE",
}

type ArrowKeys = "up" | "down";

export interface ListboxProps {
  /** Nội dung bên trong danh sách */
  children: React.ReactNode;
  /** Custom ID cho danh sách */
  customListId?: string;
  /**
   * Indicates the default active option in the list. Patterns that support option creation should default the active option to the first option.
   * @default AutoSelection.FirstSelected
   */
  autoSelection?: AutoSelection;
  /** Bật điều khiển bằng phím */
  enableKeyboardControl?: boolean;
  /** Callback khi option được selected */
  onSelect?(value: string): void;
  /** Callback khi option được active */
  onActiveOptionChange?(value: string, domId: string): void;
}

const OPTION_SELECTOR = "[data-listbox-option]";
const OPTION_VALUE_ATTRIBUTE = "data-listbox-option-value";
const OPTION_ACTION_ATTRIBUTE = "data-listbox-option-action";
const OPTION_DISABLED_ATTRIBUTE = "aria-disabled";
const OPTION_SELECTED_ATTRIBUTE = "aria-selected";
const OPTION_FOCUSED_ATTRIBUTE = "data-focused";

/**
 * Là một danh sách dọc có thể tương tác được
 */
export const Listbox: React.FC<ListboxProps> & {
  Header: typeof Header;
  Loading: typeof Loading;
  Action: typeof Action;
  Section: typeof Section;
  Option: typeof Option;
  TextOption: typeof TextOption;
} = ({
  children,
  customListId,
  enableKeyboardControl,
  autoSelection = AutoSelection.FirstSelected,
  onSelect,
  onActiveOptionChange,
}: ListboxProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentOptions, setCurrentOptions] = useState<HTMLElement[]>([]);
  const [lazyLoading, setLazyLoading] = useState(false);
  const [activeOption, setActiveOption] = useState<NavigableOption>();

  const {
    value: keyboardEventsEnabled,
    setTrue: enableKeyboardEvents,
    setFalse: disableKeyboardEvents,
  } = useToggle(Boolean(enableKeyboardControl));

  const listId = useUniqueId("Listbox", customListId);

  const scrollableRef = useRef<HTMLElement | null>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const {
    listboxId,
    textFieldFocused,
    textFieldFocusedIn,
    willLoadMoreOptions,
    setActiveOptionId,
    setListboxId,
    onKeyToBottom,
    onOptionSelected,
  } = useComboboxListbox();
  const inCombobox = Boolean(setActiveOptionId);

  useEffect(() => {
    if (setListboxId && !listboxId) {
      setListboxId(listId);
    }
  }, [setListboxId, listboxId, listId]);

  useEffect(() => {
    if (listboxRef.current) {
      scrollableRef.current = listboxRef.current.closest(scrollable.selector);
    }
  }, []);

  useEffect(() => {
    if (enableKeyboardControl && !keyboardEventsEnabled) {
      enableKeyboardEvents();
    }
  }, [enableKeyboardControl, keyboardEventsEnabled, enableKeyboardEvents]);

  const getFirstNavigableOption = useCallback(
    (currentOptions: HTMLElement[]) => {
      const hasSelectedOptions = currentOptions.some(
        (option) => option.getAttribute(OPTION_SELECTED_ATTRIBUTE) === "true"
      );

      let elementIndex = 0;
      const element = currentOptions.find((option, index) => {
        const isInteractable = option.getAttribute(OPTION_DISABLED_ATTRIBUTE) !== "true";
        let isFirstNavigableOption;
        if (hasSelectedOptions && autoSelection === AutoSelection.FirstSelected) {
          const isSelected = option.getAttribute(OPTION_SELECTED_ATTRIBUTE) === "true";
          isFirstNavigableOption = isSelected && isInteractable;
        } else {
          isFirstNavigableOption = isInteractable;
        }

        if (isFirstNavigableOption) elementIndex = index;

        return isFirstNavigableOption;
      });

      if (!element) return;

      return { element, index: elementIndex };
    },
    [autoSelection]
  );

  const getNavigableOptions = useCallback(() => {
    if (!listboxRef.current) {
      return [];
    }

    return [...new Set(listboxRef.current.querySelectorAll<HTMLElement>(OPTION_SELECTOR))];
  }, []);

  const getFormattedOption = useCallback((element: HTMLElement, index: number) => {
    return {
      element,
      index,
      domId: element.id,
      value: element.getAttribute(OPTION_VALUE_ATTRIBUTE) || "",
      disabled: element.getAttribute(OPTION_DISABLED_ATTRIBUTE) === "true",
      isAction: element.getAttribute(OPTION_ACTION_ATTRIBUTE) === "true",
    };
  }, []);

  const handleScrollIntoView = useCallback((option: NavigableOption) => {
    const { current: scrollable } = scrollableRef;

    if (scrollable) {
      scrollOptionIntoView(option.element, scrollable);
    }
  }, []);

  const handleScrollIntoViewDebounced = debounce(handleScrollIntoView, 50);

  const handleChangeActiveOption = useCallback(
    (nextOption?: NavigableOption) => {
      if (!nextOption) return setActiveOption(undefined);

      activeOption?.element.removeAttribute(OPTION_FOCUSED_ATTRIBUTE);
      nextOption.element.setAttribute(OPTION_FOCUSED_ATTRIBUTE, "true");
      handleScrollIntoViewDebounced(nextOption);
      setActiveOption(nextOption);
      setActiveOptionId?.(nextOption.domId);
      onActiveOptionChange?.(nextOption.value, nextOption.domId);
    },
    [activeOption?.element, handleScrollIntoViewDebounced, onActiveOptionChange, setActiveOptionId]
  );

  const handleKeyToBottom = useCallback(() => {
    if (onKeyToBottom) {
      setLazyLoading(true);
      return Promise.resolve(onKeyToBottom());
    }
  }, [onKeyToBottom]);

  const onOptionSelect = useCallback(
    (option: NavigableOption) => {
      handleChangeActiveOption(option);
      onOptionSelected?.();
      onSelect?.(option.value);
    },
    [handleChangeActiveOption, onOptionSelected, onSelect]
  );

  const getNextIndex = useCallback(
    (currentIndex: number, lastIndex: number, direction: string) => {
      let nextIndex;

      if (direction === "down") {
        if (currentIndex === lastIndex) {
          nextIndex = willLoadMoreOptions ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex + 1;
        }
      } else {
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
      }

      return nextIndex;
    },
    [willLoadMoreOptions]
  );

  const getNextValidOption = useCallback(
    async (key: ArrowKeys) => {
      const lastIndex = currentOptions.length - 1;
      let currentIndex = activeOption?.index || 0;
      let nextIndex = 0;
      let element = activeOption?.element;
      let totalOptions = -1;

      if (!activeOption && autoSelection === AutoSelection.None) {
        const nextOptions = getNavigableOptions();
        const nextActiveOption = getFirstNavigableOption(nextOptions);
        setCurrentOptions(nextOptions);
        return {
          element: nextActiveOption?.element,
          nextIndex: nextActiveOption?.index || 0,
        };
      }

      while (totalOptions++ < lastIndex) {
        nextIndex = getNextIndex(currentIndex, lastIndex, key);
        element = currentOptions[nextIndex];
        const triggerLazyLoad = nextIndex >= lastIndex;
        const isDisabled = element?.getAttribute("aria-disabled") === "true";

        if (triggerLazyLoad && willLoadMoreOptions) {
          await handleKeyToBottom();
        }

        if (isDisabled) {
          currentIndex = nextIndex;
          element = undefined;
          continue;
        }

        break;
      }
      return { element, nextIndex };
    },
    [
      autoSelection,
      currentOptions,
      activeOption,
      willLoadMoreOptions,
      getNextIndex,
      handleKeyToBottom,
      getFirstNavigableOption,
      getNavigableOptions,
    ]
  );

  const resetActiveOption = useCallback(() => {
    let nextOption;
    const nextOptions = getNavigableOptions();
    const nextActiveOption = getFirstNavigableOption(nextOptions);

    if (nextOptions.length === 0 && currentOptions.length > 0) {
      setCurrentOptions(nextOptions);
      handleChangeActiveOption();
      return;
    }

    if (nextActiveOption) {
      const { element, index } = nextActiveOption;
      nextOption = getFormattedOption(element, index);
    }

    const optionIsAlreadyActive = activeOption !== undefined && nextOption?.domId === activeOption?.domId;

    const actionContentHasUpdated =
      activeOption?.isAction && nextOption?.isAction && nextOption?.value !== activeOption?.value;

    const currentValues = currentOptions.map((option) => option.getAttribute(OPTION_VALUE_ATTRIBUTE));

    const nextValues = nextOptions.map((option) => option.getAttribute(OPTION_VALUE_ATTRIBUTE));

    const listIsUnchanged =
      nextValues.length === currentValues.length &&
      nextValues.every((value, index) => {
        return currentValues[index] === value;
      });

    const listIsAppended =
      currentValues.length !== 0 &&
      nextValues.length > currentValues.length &&
      currentValues.every((value, index) => {
        return nextValues[index] === value;
      });

    if (listIsUnchanged) {
      if (optionIsAlreadyActive && actionContentHasUpdated) {
        setCurrentOptions(nextOptions);
        handleChangeActiveOption(nextOption);
      }

      return;
    }

    if (listIsAppended) {
      setCurrentOptions(nextOptions);
      return;
    }

    setCurrentOptions(nextOptions);

    if (lazyLoading) {
      setLazyLoading(false);
      return;
    }

    handleChangeActiveOption(nextOption);
  }, [
    getNavigableOptions,
    getFirstNavigableOption,
    currentOptions,
    activeOption,
    lazyLoading,
    handleChangeActiveOption,
    getFormattedOption,
  ]);

  const handleArrow = useCallback(
    async (type: ArrowKeys, event: KeyboardEvent) => {
      event.preventDefault();
      const { element, nextIndex } = await getNextValidOption(type);
      if (!element) return;
      const nextOption = getFormattedOption(element, nextIndex);
      handleChangeActiveOption(nextOption);
    },
    [getFormattedOption, getNextValidOption, handleChangeActiveOption]
  );

  const handleDownArrow = useCallback(
    (event: KeyboardEvent) => {
      handleArrow("down", event);
    },
    [handleArrow]
  );

  const handleUpArrow = useCallback(
    (event: KeyboardEvent) => {
      handleArrow("up", event);
    },
    [handleArrow]
  );

  const handleEnter = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (activeOption) {
        onOptionSelect(activeOption);
      }
    },
    [activeOption, onOptionSelect]
  );

  const handleFocus = useCallback(() => {
    if (enableKeyboardControl) return;
    enableKeyboardEvents();
  }, [enableKeyboardControl, enableKeyboardEvents]);

  const handleBlur = useCallback(
    (event: React.FocusEvent) => {
      event.stopPropagation();
      if (keyboardEventsEnabled) {
        const nextActiveOption = getFirstNavigableOption(currentOptions);

        if (nextActiveOption) {
          const { element, index } = nextActiveOption;
          const nextOption = getFormattedOption(element, index);
          handleChangeActiveOption(nextOption);
        }
      }
      if (enableKeyboardControl) return;
      disableKeyboardEvents();
    },
    [
      enableKeyboardControl,
      currentOptions,
      keyboardEventsEnabled,
      disableKeyboardEvents,
      getFirstNavigableOption,
      getFormattedOption,
      handleChangeActiveOption,
    ]
  );

  useEventListener("keydown", async (event) => {
    if (!keyboardEventsEnabled && !textFieldFocused && !textFieldFocusedIn) {
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        handleDownArrow(event);
        break;
      case "ArrowUp":
        handleUpArrow(event);
        break;
      case "Enter":
        handleEnter(event);
        break;
    }
  });

  useEffect(() => {
    if (autoSelection !== AutoSelection.None && !loading && children && React.Children.count(children) > 0) {
      resetActiveOption();
    }
  }, [children, activeOption, loading, resetActiveOption, autoSelection]);

  const listboxContext = useMemo(
    (): ListboxContextType => ({
      setLoading,
      onOptionSelect,
    }),
    [onOptionSelect]
  );

  return (
    <ListboxContext.Provider value={listboxContext}>
      {children ? (
        <StyledListbox
          id={listId}
          tabIndex={0}
          role="listbox"
          ref={listboxRef}
          onFocus={inCombobox ? undefined : handleFocus}
          onBlur={inCombobox ? undefined : handleBlur}
        >
          {children}
        </StyledListbox>
      ) : null}
    </ListboxContext.Provider>
  );
};

Listbox.Option = Option;
Listbox.TextOption = TextOption;
Listbox.Loading = Loading;
Listbox.Header = Header;
Listbox.Action = Action;
Listbox.Section = Section;

const StyledListbox = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  max-width: 100%;

  &:focus {
    outline: none;
  }
`;
