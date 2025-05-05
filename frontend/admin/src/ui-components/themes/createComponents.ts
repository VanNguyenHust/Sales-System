import { merge } from "lodash-es";

import {
  badgeTokens as defaultBadgeTokens,
  dataTableTokens as defaultDataTableTokens,
  indexTableTokens as defaultIndexTableTokens,
  navigationTokens as defaultNavigationTokens,
  rangeSliderTokens as defaultRangeSliderTokens,
  scrollBarTokens as defaultScrollBarTokens,
  toastTokens as defaultToastTokens,
  toggleButtonTokens as defaultToggleButtonTokens,
  tooltipTokens as defaultTooltipTokens,
} from "./defaultTheme";

export interface ThemeComponentNavigationTokens {
  backgroundColor: string;
  backgroundHoveredColor: string;
  backgroundPressedColor: string;
  backgroundSelectedColor: string;
  textColor: string;
  textSelectedColor: string;
  textDisabledColor: string;
  textSecondarySelectedColor: string;
  iconColor: string;
  iconSelectedColor: string;
  dividerColor: string;
}

export interface ThemeComponentNavigation extends ThemeComponentNavigationTokens {
  maxWidth: string;
  baseWidth: string;
  mobileWidth: string;
  mobileHeight: string;
  desktopHeight: string;
  collapsedWidth: string;
}

export interface ThemeComponentToggleButtonTokens {
  backgroundSwitchOff: string;
  backgroundSwitchOn: string;
  backgroundSliderRoundOff: string;
  backgroundSliderRoundOn: string;
  backgroundSwitchDisabled: string;
  backgroundSliderRoundDisabled: string;
  backgroundSliderRoundCheckedDisabled: string;
  shadowSliderRound: string;
}

export interface ThemeComponentToastTokens {
  iconColor: string;
  backgroundSuccessColor: string;
  backgroundCriticalColor: string;
  backgroundColor: string;
  textPrimaryColor: string;
  transformHeight: string;
}

interface ThemeComponentToast extends ThemeComponentToastTokens {
  maxWidth: string;
  minWidth: string;
  mobileMaxWidth: string;
}

export interface ThemeComponentScrollBarTokens {
  scrollBarTrackColor: string;
  scrollBarThumbColor: string;
  scrollBarThumbHoverColor: string;
}

interface ThemeComponentLayout {
  widthPrimary: string;
  widthSecondary: string;
  widthOneHalf: string;
  widthOneThird: string;
  widthInnerSpacingBase: string;
}

interface ThemeComponentTopBar {
  height: string;
  searchMaxWidth: string;
  usernameMaxWidth: string;
}

interface ThemeComponentPage {
  maxWidth: string;
}

export interface ThemeComponentBadgeTokens {
  textColor: string;
  borderColor: string;
  backgroundColor: string;
  textSuccessColor: string;
  borderSuccessColor: string;
  backgroundSuccessColor: string;
  textWarningColor: string;
  borderWarningColor: string;
  backgroundWarningColor: string;
  textCriticalColor: string;
  borderCriticalColor: string;
  backgroundCriticalColor: string;
  textHighlightColor: string;
  borderHighlightColor: string;
  backgroundHighlightColor: string;
  textNewColor: string;
  borderNewColor: string;
  backgroundNewColor: string;
}

interface ThemeComponentBadge extends ThemeComponentBadgeTokens {}

export interface ThemeComponentTooltipTokens {
  textColor: string;
  backgroundColor: string;
  borderColor: string;
}

export interface ThemeComponentRangeSliderTokens {
  trackColor: string;
  runnableTrackColor: string;
  thumbColor: string;
  thumbOutlineColor: string;
  disabledThumbColor: string;
  disabledTrackColor: string;
  disabledRunnableTrackColor: string;
}

interface ThemeComponentTooltip extends ThemeComponentTooltipTokens {
  maxWidth: {
    default: number;
    wide: number;
  };
}

export interface ThemeComponents {
  layout: ThemeComponentLayout;
  page: ThemeComponentPage;
  navigation: ThemeComponentNavigation;
  modal: ThemeComponentModal;
  datePicker: ThemeComponentDatePicker;
  toast: ThemeComponentToast;
  toggleButton: ThemeComponentToggleButtonTokens;
  topBar: ThemeComponentTopBar;
  scrollBar: ThemeComponentScrollBarTokens;
  popover: ThemeComponentPopover;
  tooltip: ThemeComponentTooltip;
  form: {
    itemMinWidth: string;
    controlHeight: string;
  };
  filters: {
    defaultWidth: string;
  };
  indexTable: ThemeComponentIndexTable;
  dataTable: ThemeComponentDataTable;
  badge: ThemeComponentBadge;
  rangeSlider: ThemeComponentRangeSlider;
}

interface ThemeComponentModal {
  maxWidthSm: string;
  maxWidth: string;
  maxWidthLg: string;
  maxWidthExtraLg: string;
}

interface ThemeComponentDatePicker {
  minWidth: string;
  cellSize: string;
}

export interface ThemeComponentIndexTableTokens {
  headerBackgroundColor: string;
  translateOffset: string;
}

export interface ThemeComponentDataTableTokens {
  zebraBackgroundColor: string;
  firstColumnMaxWidth: string;
}

interface ThemeComponentPopover {
  maxHeight: number;
  maxWidth: number;
}

interface ThemeComponentIndexTable extends ThemeComponentIndexTableTokens {}

interface ThemeComponentDataTable extends ThemeComponentDataTableTokens {}

export interface ThemeComponentNavInput extends Partial<ThemeComponentNavigation> {}
export interface ThemeComponentToastInput extends Partial<ThemeComponentToastTokens> {}
export interface ThemeComponentToggleButtonInput extends Partial<ThemeComponentToggleButtonTokens> {}
export interface ThemeComponentModalInput extends Partial<ThemeComponentModal> {}
export interface ThemeComponentLayoutInput extends Partial<ThemeComponentLayout> {}
export interface ThemeComponentTopBarInput extends Partial<ThemeComponentTopBar> {}
export interface ThemeComponentBadgeInput extends Partial<ThemeComponentBadge> {}
export interface ThemeComponentIndexTableInput extends Partial<ThemeComponentIndexTableTokens> {}
export interface ThemeComponentDataTableInput extends Partial<ThemeComponentDataTableTokens> {}
export interface ThemeComponentTooltipInput extends Partial<ThemeComponentTooltipTokens> {}
export interface ThemeComponentPopoverInput extends Partial<ThemeComponentPopover> {}
export interface ThemeComponentRangeSlider extends Partial<ThemeComponentRangeSliderTokens> {}

export interface ThemeComponentsInput {
  navigation?: ThemeComponentNavInput;
  toast?: ThemeComponentToastInput;
  toggleButton?: ThemeComponentToggleButtonInput;
  modal?: ThemeComponentModalInput;
  layout?: ThemeComponentLayoutInput;
  topBar?: ThemeComponentTopBarInput;
  badge?: ThemeComponentBadgeInput;
  indexTable?: ThemeComponentIndexTableInput;
  dataTable?: ThemeComponentDataTableInput;
  tooltip?: ThemeComponentTooltipInput;
  popover?: ThemeComponentPopoverInput;
  rangeSlider?: ThemeComponentRangeSlider;
}

export function createComponents(components: ThemeComponentsInput): ThemeComponents {
  const layout: ThemeComponents["layout"] = merge(
    {
      widthPrimary: "693px",
      widthSecondary: "339px",
      widthOneHalf: "450px",
      widthOneThird: "240px",
      widthInnerSpacingBase: "104px",
    },
    components.layout
  );
  const page: ThemeComponents["page"] = {
    maxWidth: `calc(${layout.widthPrimary} + ${layout.widthSecondary} + ${layout.widthInnerSpacingBase})`,
  };
  const nav: ThemeComponentNavigation = {
    maxWidth: "230px",
    baseWidth: "230px",
    mobileWidth: "calc(100vw - 5.2rem)",
    mobileHeight: "32px",
    desktopHeight: "32px",
    collapsedWidth: "48px",
    ...merge(defaultNavigationTokens, components.navigation),
  };
  const toggleButton: ThemeComponentToggleButtonTokens = merge(defaultToggleButtonTokens, components.toggleButton);

  const toast: ThemeComponentToast = {
    maxWidth: "700px",
    mobileMaxWidth: "calc(100vw - 4rem)",
    minWidth: "200px",
    ...merge(defaultToastTokens, components.toast),
  };
  const topBar: ThemeComponents["topBar"] = merge(
    {
      height: "52px",
      searchMaxWidth: "600px",
      usernameMaxWidth: "140px",
    },
    components.topBar
  );
  const badge: ThemeComponentBadge = merge(defaultBadgeTokens, components.badge);

  const scrollBar: ThemeComponents["scrollBar"] = defaultScrollBarTokens;

  const popover: ThemeComponentPopover = merge(
    {
      maxHeight: 500,
      maxWidth: 500,
    },
    components.popover
  );

  const form: ThemeComponents["form"] = {
    itemMinWidth: "220px",
    controlHeight: "36px",
  };

  const tooltip: ThemeComponentTooltip = {
    maxWidth: {
      default: 200,
      wide: 275,
    },
    ...merge(defaultTooltipTokens, components.tooltip),
  };

  const modal: ThemeComponents["modal"] = merge(
    {
      maxWidthSm: "500px",
      maxWidth: "700px",
      maxWidthLg: "900px",
      maxWidthExtraLg: "1100px",
    },
    components.modal
  );

  const datePicker: ThemeComponents["datePicker"] = {
    minWidth: "312px",
    cellSize: "28px",
  };

  const filters: ThemeComponents["filters"] = {
    defaultWidth: "350px",
  };

  const rangeSlider: ThemeComponents["rangeSlider"] = merge(defaultRangeSliderTokens, components.rangeSlider);

  const indexTable: ThemeComponentIndexTable = merge(defaultIndexTableTokens, components.indexTable);
  const dataTable: ThemeComponentDataTable = merge(defaultDataTableTokens, components.dataTable);

  return {
    layout,
    page,
    navigation: nav,
    topBar,
    toast,
    toggleButton,
    scrollBar,
    popover,
    tooltip,
    form,
    modal,
    datePicker,
    filters,
    indexTable,
    dataTable,
    badge,
    rangeSlider,
  };
}
