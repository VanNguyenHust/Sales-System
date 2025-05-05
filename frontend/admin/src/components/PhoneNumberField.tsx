import { useEffect, useMemo, useReducer, useState } from "react";
import { Button, Icon, Listbox, Popover, TextField, type TextFieldProps } from "@/ui-components";
import { SearchIcon } from "@/ui-icons";
import { PhoneNumber, PhoneNumberFormat } from "google-libphonenumber";

import { useGetSupportedPhoneRegionsQuery } from "app/api";
import { SelectEmptyState } from "app/components/SelectEmptyState";
import { phoneUtils } from "app/utils/phone";
import { isSearchTextMatch } from "app/utils/text";
import { useTenant } from "app/utils/useTenant";
import { useToggle } from "app/utils/useToggle";

import "flag-icons/css/flag-icons.min.css";

export interface PhoneNumberFieldProps extends TextFieldProps {
  onChange?: (value: string) => void;
}

type Options = {
  label: string;
  value: string;
}[];

type State = {
  text: string;
  region: string;
  value: string;
};

type Action =
  | { type: "init"; text: string; preferedRegion: string }
  | { type: "changeText"; text: string }
  | { type: "changeRegion"; region: string };

const NO_REGION = "ZZ";

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "init": {
      const phoneNumber = parsePhone(action.text, action.preferedRegion);
      const countryCode = phoneNumber?.getCountryCode();
      const region = countryCode ? phoneUtils.getRegionCodeForCountryCode(countryCode) : action.preferedRegion;
      return {
        text: action.text,
        region: region !== NO_REGION ? region : action.preferedRegion,
        value: phoneNumber ? phoneUtils.format(phoneNumber, PhoneNumberFormat.E164) : action.text,
      };
    }
    case "changeText": {
      const phoneNumber = parsePhone(action.text, state.region);
      const formattedValue = phoneNumber ? phoneUtils.format(phoneNumber, PhoneNumberFormat.E164) : null;
      const countryCode = phoneNumber?.getCountryCode();
      const region = countryCode ? phoneUtils.getRegionCodeForCountryCode(countryCode) : state.region;
      return {
        text: action.text,
        value: formattedValue ? formattedValue : action.text,
        region: region !== NO_REGION ? region : state.region,
      };
    }
    case "changeRegion": {
      if (state.region === action.region) {
        return state;
      }
      const phoneNumber = parsePhone(state.value, state.region);
      const coutryCode = phoneUtils.getCountryCodeForRegion(action.region);
      if (phoneNumber && coutryCode) {
        phoneNumber.setCountryCode(coutryCode);
      }
      const formattedValue = phoneNumber ? phoneUtils.format(phoneNumber, PhoneNumberFormat.E164) : null;
      return {
        text: formattedValue ? formattedValue : state.text,
        region: action.region,
        value: formattedValue ? formattedValue : state.value,
      };
    }
    default:
      return state;
  }
}

export const PhoneNumberField = ({ disabled, value = "", onChange, ...restProps }: PhoneNumberFieldProps) => {
  const { data: regions = [], isLoading } = useGetSupportedPhoneRegionsQuery();
  const {
    tenant: { country_code },
  } = useTenant();
  const [state, dispatch] = useReducer(
    reducer,
    reducer({} as State, { type: "init", text: value, preferedRegion: country_code })
  );
  const [query, setQuery] = useState("");
  const { value: isOpenRegionPopover, setFalse: closeRegionPopover, toggle: toggleRegionPopover } = useToggle(false);

  const options = useMemo(
    (): Options =>
      regions.map((region) => ({
        label: region.text,
        value: region.id,
      })),
    [regions]
  );

  // flush state on onChange callback
  useEffect(() => {
    if (value !== state.value) {
      onChange?.(state.value);
    }
  }, [onChange, state.value, value]);

  const handleTextChange = (value: string) => {
    dispatch({ type: "changeText", text: value });
  };

  const handleSelectRegion = (region: string) => {
    handleCloseRegionPopover();
    dispatch({ type: "changeRegion", region });
  };

  const handleCloseRegionPopover = () => {
    closeRegionPopover();
    // reset query
    setQuery("");
  };

  const filteredOptions = query ? options.filter((option) => isSearchTextMatch(option.label, query)) : options;
  const regionMarkups =
    filteredOptions.length > 0 || isLoading ? (
      <Listbox onSelect={handleSelectRegion} enableKeyboardControl>
        {filteredOptions.map((option) => (
          <Listbox.Option key={option.value} value={option.value} selected={option.value === state.region}>
            {option.label}
          </Listbox.Option>
        ))}
        {isLoading ? <Listbox.Loading /> : null}
      </Listbox>
    ) : null;

  const regionActivatorMarkup = (
    <Button
      onClick={toggleRegionPopover}
      disabled={disabled}
      icon={() => <Flag countryCode={state.region} />}
      disclosure={isOpenRegionPopover ? "up" : "down"}
    />
  );

  const searchFieldMarkup = (
    <Popover.Pane fixed>
      <TextField
        borderless
        placeholder="Tìm kiếm"
        prefix={<Icon source={SearchIcon} color="base" />}
        value={query}
        onChange={setQuery}
      />
    </Popover.Pane>
  );

  const emptyStateMarkup = !isLoading && filteredOptions.length === 0 ? <SelectEmptyState /> : null;

  const regionSelectMarkup = (
    <Popover
      active={isOpenRegionPopover}
      onClose={handleCloseRegionPopover}
      activator={regionActivatorMarkup}
      preferredAlignment="right"
      autofocusTarget="first-node"
    >
      {searchFieldMarkup}
      <Popover.Pane>
        {regionMarkups}
        {emptyStateMarkup}
      </Popover.Pane>
    </Popover>
  );

  return (
    <TextField
      {...restProps}
      connectedRight={regionSelectMarkup}
      value={state.text}
      disabled={disabled}
      onChange={handleTextChange}
    />
  );
};

function parsePhone(value: string, region: string): PhoneNumber | null {
  try {
    const phoneNumber = phoneUtils.parse(value, region);
    return phoneNumber;
  } catch (e) {
    return null;
  }
}

interface FlagProps {
  countryCode?: string;
}

function Flag({ countryCode }: FlagProps) {
  return (
    <span
      className={countryCode ? `fi fi-${countryCode.toLowerCase()}` : "fi"}
      style={{ display: "flex", height: "100%" }}
    />
  );
}
