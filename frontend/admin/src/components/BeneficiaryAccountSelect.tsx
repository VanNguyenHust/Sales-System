import { ReactNode, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Autocomplete, type AutocompleteProps, Text } from "@/ui-components";
import { PlusCircleOutlineIcon } from "@/ui-icons";
import { toString } from "lodash-es";
import { useDebounce } from "use-debounce";

import { SelectEmptyState } from "app/components/SelectEmptyState";
import { useDispatch } from "app/types";
import { useToggle } from "app/utils/useToggle";

import {
  beneficiaryAccountApi,
  useCountBeneficiaryAccountsQuery,
  useGetBeneficiaryAccountQuery,
  useGetBeneficiaryAccountsWithInfiniteQuery,
} from "../features/setting/pages/beneficiary-account/api";
import { getBankLogo } from "../features/setting/pages/beneficiary-account/utils/constants";

type Props = {
  label?: string;
  value?: number;
  placeholder?: string;
  requiredIndicator?: boolean;
  error?: string;
  onChange: (value: number) => void;
  onActionBefore?: () => void;
};

type Options = {
  label: ReactNode;
  value: string;
  labelSelected: string;
}[];

export const BeneficiaryAccountSelect = ({
  label = "Tài khoản thụ hưởng",
  placeholder = "Chọn tài khoản thụ hưởng",
  value,
  onChange,
  onActionBefore,
  ...selectRestProps
}: Props) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [debounceQuery, { isPending }] = useDebounce(query, 300);
  const pending = isPending();

  const { value: lazy, setFalse: clearLazy } = useToggle(value ? false : true);

  const { data: count, isFetching: isFetchingCount } = useCountBeneficiaryAccountsQuery(
    { query: debounceQuery },
    { skip: lazy }
  );

  const { currentData: items, isFetching } = useGetBeneficiaryAccountsWithInfiniteQuery(
    {
      query: debounceQuery,
      page,
      limit: 20,
    },
    {
      skip: pending || lazy,
    }
  );

  const { data: valueSelected, isFetching: isFetchingSelected } = useGetBeneficiaryAccountQuery(value ?? 0, {
    skip: !value,
  });

  const hasMore = !pending && count !== (items || []).length;
  const loading = isFetching || isFetchingCount || pending || isFetchingSelected;

  const options = useMemo((): Options => {
    return (items || []).map((item) => ({
      value: String(item?.id),
      label: (
        <StyledItem>
          <StyledImage>
            <img src={getBankLogo(item.bank_id)} />
          </StyledImage>
          <div>
            <Text as="p" variant="bodyMd" fontWeight="medium">{`${item?.account_number} - ${item?.account_name}`}</Text>
            <Text as="p" variant="bodyMd">{`${item?.bank_short_name} - ${item?.bank_name}`}</Text>
          </div>
        </StyledItem>
      ),
      labelSelected: `${item?.bank_short_name} - ${item?.account_number} - ${item?.account_name}`,
    }));
  }, [items]);

  // reset query when focus
  const handleSelectFocus = () => {
    clearLazy();
    setQuery("");
  };

  const handleChangeQuery = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  const handleSelect = async (values: string[]) => {
    const id = Number(values[0]);
    const selected = items?.find((item) => item.id === id);
    if (selected) {
      // manual set cache
      await dispatch(beneficiaryAccountApi.util.upsertQueryData("getBeneficiaryAccount", id, selected));
    }
    onChange(id);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((page) => page + 1);
    }
  };

  const selected = options.filter((option) => toString(value) === option.value);

  const textField = (
    <Autocomplete.Select
      {...selectRestProps}
      label={label}
      value={selected[0]?.value ?? ""}
      placeholder={
        selected[0]?.labelSelected || valueSelected
          ? `${valueSelected?.bank_short_name} - ${valueSelected?.account_number} - ${valueSelected?.account_name}`
          : placeholder
      }
      onFocus={handleSelectFocus}
    />
  );

  const actionBefore: AutocompleteProps["actionBefore"] = {
    primary: true,
    divider: true,
    icon: PlusCircleOutlineIcon,
    content: "Thêm mới tài khoản thụ hưởng",
    onAction: onActionBefore,
  };

  return (
    <Autocomplete
      header={<Autocomplete.HeaderSearch value={query} onChange={handleChangeQuery} />}
      options={options}
      selected={[toString(value)]}
      onSelect={handleSelect}
      textField={textField}
      loading={loading}
      emptyState={<SelectEmptyState />}
      onLoadMoreResults={loadMore}
      willLoadMoreResults={hasMore}
      actionBefore={actionBefore}
    />
  );
};

const StyledItem = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(2)};
`;

const StyledImage = styled.div`
  display: flex;
  &,
  img {
    width: 40px;
    height: 40px;
  }
`;
