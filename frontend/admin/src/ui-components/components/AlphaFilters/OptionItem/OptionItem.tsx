import React, { useCallback, useMemo, useState } from "react";
import styled from "@emotion/styled";

import { OptionDescriptor } from "../../../types";
import { isSection } from "../../../utils/options";
import { type AutocompleteProps } from "../../Autocomplete";
import {
  ComboboxListboxContext,
  ComboboxListboxOptionContext,
  ComboboxListboxOptionType,
  ComboboxListboxType,
} from "../../Combobox/context";
import { Listbox } from "../../Listbox";
import { OptionItemContent, WithinOptionItemContext } from "../context";
import { ItemProps } from "../Item";
import { Pane } from "../Pane";

interface Props
  extends Pick<
      AutocompleteProps,
      | "options"
      | "selected"
      | "allowMultiple"
      | "emptyState"
      | "loading"
      | "onLoadMoreResults"
      | "willLoadMoreResults"
      | "onSelect"
    >,
    Pick<ItemProps, "limitWidth"> {
  children?: React.ReactNode;
}

export const OptionItem = ({
  limitWidth,
  selected,
  loading,
  willLoadMoreResults,
  options,
  emptyState,
  allowMultiple,
  children,
  onSelect,
  onLoadMoreResults,
}: Props) => {
  const buildMappedOptionFromOption = useCallback(
    (options: OptionDescriptor[]) => {
      return options.map((option) => (
        <Listbox.Option
          key={option.value}
          selected={selected.includes(option.value)}
          disabled={option.disabled}
          value={option.value}
        >
          <Listbox.TextOption selected={selected.includes(option.value)} disabled={option.disabled} breakWord>
            {option.label}
          </Listbox.TextOption>
        </Listbox.Option>
      ));
    },
    [selected]
  );

  const optionsMarkup = useMemo(() => {
    const conditionalOptions = loading && !willLoadMoreResults ? [] : options;

    if (isSection(conditionalOptions)) {
      const noOptionsAvailable = conditionalOptions.every(({ options }) => options.length === 0);
      if (noOptionsAvailable) {
        return null;
      }
      const optionsMarkup = conditionalOptions.map(({ options, title }) => {
        if (options.length === 0) {
          return null;
        }
        const optionMarkup = buildMappedOptionFromOption(options);
        return (
          <Listbox.Section divider={false} title={<Listbox.Header>{title}</Listbox.Header>} key={title}>
            {optionMarkup}
          </Listbox.Section>
        );
      });
      return <StyledSectionWrapper>{optionsMarkup}</StyledSectionWrapper>;
    }
    return conditionalOptions.length > 0 ? buildMappedOptionFromOption(conditionalOptions) : null;
  }, [loading, willLoadMoreResults, options, buildMappedOptionFromOption]);

  const loadingMarkup = loading ? <Listbox.Loading /> : null;

  const emptyStateMarkup = emptyState && !options.length && !loading ? <div role="status">{emptyState}</div> : null;

  const updateSelection = useCallback(
    (newSelection: string) => {
      if (allowMultiple) {
        if (selected.includes(newSelection)) {
          onSelect(selected.filter((option) => option !== newSelection));
        } else {
          onSelect([...selected, newSelection]);
        }
      } else {
        onSelect([newSelection]);
      }
    },
    [allowMultiple, onSelect, selected]
  );
  const [listboxId, setListboxId] = useState<string>();

  const listboxContextValue = useMemo(
    (): ComboboxListboxType => ({
      listboxId,
      willLoadMoreOptions: willLoadMoreResults,
      setListboxId,
    }),
    [listboxId, willLoadMoreResults]
  );

  const listboxOptionContextValue = useMemo(
    (): ComboboxListboxOptionType => ({
      allowMultiple,
    }),
    [allowMultiple]
  );

  const listboxMarkup = (
    <WithinOptionItemContext.Provider value>
      <ComboboxListboxContext.Provider value={listboxContextValue}>
        <ComboboxListboxOptionContext.Provider value={listboxOptionContextValue}>
          <StyledListbox>
            {optionsMarkup || loadingMarkup || emptyStateMarkup ? (
              <Listbox onSelect={updateSelection} enableKeyboardControl>
                {optionsMarkup && (!loading || willLoadMoreResults) ? optionsMarkup : null}
                {loadingMarkup}
                {emptyStateMarkup}
              </Listbox>
            ) : null}
          </StyledListbox>
        </ComboboxListboxOptionContext.Provider>
      </ComboboxListboxContext.Provider>
    </WithinOptionItemContext.Provider>
  );

  const context = useMemo(
    () => ({
      limitWidth,
    }),
    [limitWidth]
  );

  return (
    <>
      <OptionItemContent.Provider value={context}>{children}</OptionItemContent.Provider>
      <Pane onScrolledToBottom={onLoadMoreResults} limitWidth={limitWidth}>
        {listboxMarkup}
      </Pane>
    </>
  );
};

const StyledSectionWrapper = styled.div``;

const StyledListbox = styled.div`
  padding: ${(p) => p.theme.spacing(1, 0)};
  overflow: visible;
`;
