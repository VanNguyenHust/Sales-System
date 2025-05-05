import React from "react";
import type { JSX } from "react";
import { ArrowChevronDuoRightIcon } from "@/ui-icons";

import { useBreakpoints } from "../../utils/useBreakpoints";
import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { Icon } from "../Icon";
import { InlineGrid } from "../InlineGrid";
import { InlineStack } from "../InlineStack";

export function Backdrop() {
  const { smUp, mdUp } = useBreakpoints();
  let colsMarkup: JSX.Element;
  if (mdUp) {
    colsMarkup = (
      <>
        <Content width="75%" />
        <Content width="85%" />
        <Content width="95%" />
        <Content width="65%" />
        <Content width="65%" />
        <Content width="85%" />
        <Content width="75%" />
      </>
    );
  } else if (smUp) {
    colsMarkup = (
      <>
        <Content width="75%" />
        <Content width="85%" />
        <Content width="65%" />
        <Content width="85%" />
        <Content width="75%" />
      </>
    );
  } else {
    colsMarkup = (
      <>
        <Content width="75%" />
        <Content width="85%" />
      </>
    );
  }

  const rowMarkup = (
    <InlineGrid
      columns={{ xs: "60px repeat(2, 1fr)", sm: "60px repeat(5, 1fr)", md: "60px repeat(7, 1fr)" }}
      alignItems="center"
      gap="5"
    >
      <InlineStack wrap={false} blockAlign="center">
        <Icon source={ArrowChevronDuoRightIcon} color="base" />
        <Box width="16px" height="16px" borderWidth="05" borderColor="border-subdued" borderRadius="1" />
      </InlineStack>

      {colsMarkup}
    </InlineGrid>
  );
  return (
    <BlockStack>
      <Box paddingBlock="3" borderBlockEndWidth="025" borderColor="border-disabled" opacity="0.5">
        {rowMarkup}
      </Box>
      <Box paddingBlock="3" borderBlockEndWidth="025" borderColor="border-disabled" opacity="0.3">
        {rowMarkup}
      </Box>
      <Box paddingBlock="3" opacity="0.1">
        {rowMarkup}
      </Box>
    </BlockStack>
  );
}

type ContentProps = {
  width: string;
};

function Content({ width }: ContentProps) {
  return (
    <Box width="100%">
      <Box background="bg-strong" height="12px" borderRadius="base" width={width} />
    </Box>
  );
}
