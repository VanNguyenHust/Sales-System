import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";

import { OptionDescriptor, SectionDescriptor } from "../../types";
import { createNormalizedOptions, optionArraysAreEqual } from "../../utils/options";
import { useUniqueId } from "../../utils/uniqueId";
import { useDeepEffect } from "../../utils/useDeepEffect";

import { Option } from "./Option";

export interface OptionListProps {
  /** Id của option list */
  id?: string;
  /** Tiêu đề của list */
  title?: string;
  /** Danh sách lựa chọn */
  options?: OptionDescriptor[];
  /** Các phần chứa tiêu đề và các lựa chọn liên quan */
  sections?: SectionDescriptor[];
  /** Các option đã chọn */
  selected: string[];
  /** Cho phép chọn nhiều hơn 1 lựa chọn */
  allowMultiple?: boolean;
  /** Callback when lựa chọn thay đổi */
  onChange(selected: string[]): void;
}

/**
 * OptionList cho phép bạn tạo danh sách các mặt hàng được nhóm mà người bán có thể chọn. Điều này có thể bao gồm một lựa chọn hoặc nhiều lựa chọn tùy chọn.
 *
 * Danh sách tùy chọn được tạo kiểu khác với ChoiceList và không nên được sử dụng trong biểu mẫu mà dưới dạng menu độc lập.
 */
export function OptionList({
  options,
  sections,
  title,
  selected,
  allowMultiple,
  onChange,
  id: idProp,
}: OptionListProps) {
  const [normalizedOptions, setNormalizedOptions] = useState(createNormalizedOptions(options, sections, title));
  const id = useUniqueId("OptionList", idProp);

  useDeepEffect(
    () => {
      setNormalizedOptions(createNormalizedOptions(options || [], sections || [], title));
    },
    [options, sections, title],
    optionArraysAreEqual
  );

  const handleClick = useCallback(
    (sectionIndex: number, optionIndex: number) => {
      const selectedValue = normalizedOptions[sectionIndex].options[optionIndex].value;
      const foundIndex = selected.indexOf(selectedValue);
      if (allowMultiple) {
        const newSelection =
          foundIndex === -1
            ? [selectedValue, ...selected]
            : [...selected.slice(0, foundIndex), ...selected.slice(foundIndex + 1, selected.length)];
        onChange(newSelection);
        return;
      }
      onChange([selectedValue]);
    },
    [normalizedOptions, selected, allowMultiple, onChange]
  );

  const optionsExist = normalizedOptions.length > 0;

  const optionsMarkup = optionsExist
    ? normalizedOptions.map(({ title, options }, sectionIndex) => {
        const titleMarkup = title ? <StyledTitle>{title}</StyledTitle> : null;
        const sectionOptionsMarkup =
          options &&
          options.map((option, optionIndex) => {
            const isSelected = selected.includes(option.value);
            const optionId = `${id}-${sectionIndex}-${optionIndex}`;
            return (
              <Option
                key={optionId}
                {...option}
                id={optionId}
                section={sectionIndex}
                index={optionIndex}
                onClick={handleClick}
                selected={isSelected}
                allowMultiple={allowMultiple}
              />
            );
          });
        return (
          <StyledOptionListContainer key={title || `noTitle-${sectionIndex}`}>
            {titleMarkup}
            {sectionOptionsMarkup}
          </StyledOptionListContainer>
        );
      })
    : null;

  return <StyledOptionList>{optionsMarkup}</StyledOptionList>;
}

const StyledOptionList = styled.ul`
  list-style: none;
  padding: ${(p) => p.theme.spacing(1)};
  margin: 0;
`;

const StyledOptionListContainer = styled.div`
  &:not(:first-of-type) {
    border-top: ${(p) => p.theme.shape.borderDivider};
    margin-top: ${(p) => p.theme.spacing(2)};
    padding-top: ${(p) => p.theme.spacing(1)};
  }
`;

const StyledTitle = styled.li`
  padding: ${(p) => p.theme.spacing(2)};
  font-size: ${(p) => p.theme.typography.fontSize200};
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
`;
