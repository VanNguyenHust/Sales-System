interface ThemeZIndexTokens {
  z1: number;
  z2: number;
  z3: number;
  z4: number;
  z5: number;
  z6: number;
  z7: number;
  z8: number;
  z9: number;
  z10: number;
  z11: number;
  z12: number;
}

const zIndexMap = {
  1: "z1",
  2: "z2",
  3: "z3",
  4: "z4",
  5: "z6",
  6: "z6",
  7: "z7",
  8: "z8",
  9: "z9",
  10: "z10",
  11: "z11",
  12: "z12",
} as const;

export type ThemeZIndexArgument = keyof typeof zIndexMap;

export interface ThemeZIndex {
  (value: ThemeZIndexArgument): number;
  sidemenu: number;
  dropdown: number;
  modalBackdrop: number;
  modal: number;
  portal: number;
  toast: number;
  popover: number;
  inputBackdrop: number;
  inputContent: number;
  input: number;
  indexTableStickyCell: number;
  indexTableScrollBar: number;
  indexTableLoadingPanel: number;
  indexTableBulkAction: number;
  topBar: number;
  navigation: number;
  loadingBar: number;
  contextualSaveBar: number;
}

const defaultZIndexs: ThemeZIndexTokens = {
  z1: 100,
  z2: 400,
  z3: 510,
  z4: 512,
  z5: 513,
  z6: 514,
  z7: 515,
  z8: 516,
  z9: 517,
  z10: 518,
  z11: 519,
  z12: 520,
};

export function createZIndex(): ThemeZIndex {
  const zIndex: ThemeZIndex = (value: ThemeZIndexArgument): number => {
    return defaultZIndexs[zIndexMap[value]];
  };
  zIndex.inputBackdrop = 10;
  zIndex.inputContent = 20;
  zIndex.input = 30;
  zIndex.sidemenu = defaultZIndexs.z1;
  zIndex.dropdown = defaultZIndexs.z2;
  zIndex.contextualSaveBar = defaultZIndexs.z5;
  zIndex.loadingBar = defaultZIndexs.z6;
  zIndex.portal = defaultZIndexs.z7;
  zIndex.indexTableStickyCell = 31;
  zIndex.indexTableScrollBar = 35;
  zIndex.indexTableBulkAction = 36;
  zIndex.indexTableLoadingPanel = 37;
  zIndex.topBar = defaultZIndexs.z4;
  zIndex.navigation = defaultZIndexs.z8;
  zIndex.popover = defaultZIndexs.z9;
  zIndex.modalBackdrop = defaultZIndexs.z10;
  zIndex.modal = defaultZIndexs.z11;
  zIndex.toast = defaultZIndexs.z12;

  return zIndex;
}
