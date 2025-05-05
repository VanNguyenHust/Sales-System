import { merge } from "lodash-es";

import { colorTokens as defaultColorTokens } from "./defaultTheme";

export type ThemeColorsMode = "light" | "dark";

interface ThemeColorCommonTokens {
  /** Sử dụng màu background cho một số đối tượng như Page, Frame */
  background: string;
  /** Sử dụng màu background khi đối tượng như action, navigation hover */
  backgroundHoverred: string;
  /** Sử dụng màu background khi đối tượng như action, navigation press */
  backgroundPressed: string;
  /** Sử dụng màu background khi đối tượng như action, navigation được chọn */
  backgroundSelected: string;
  /** Sử dụng màu background cho các đối tượng cần nhấn mạnh như Skeleton */
  backgroundStrong: string;
  /** Sử dụng cho background color trong các component như Card, Modal, and Popover. */
  surface: string;
  /** Sử dụng cho subdued background color trong các component như Card, Modal, and Popover. */
  surfaceSubdued: string;
  /** Sử dụng cho surface color cho các đối tượng có tính tương tác như option list, action list khi được disabled */
  surfaceDisabled: string;
  /** Sử dụng cho surface color cho các đối tượng có tính tương tác như ResourceList và các action khi được hover */
  surfaceHovered: string;
  /** Sử dụng cho surface color cho các đối tượng có tính tương tác như ResourceList và các action khi được hover trong dark mode */
  surfaceHoveredDark: string;
  /** Sử dụng cho surface color cho các đối tượng có tính tương tác như ResourceList và các action khi được press  */
  surfacePressed: string;
  /**Sử dụng cho surface color cho các đối tượng có tính tương tác như ResourceList và các action khi được press trong dark mode */
  surfacePressedDark: string;
  /** For use as a surface color on interactive elements such as resource list items and action list items when in a depressed state. */
  surfaceDepressed: string;
  /** Được sử dụng cho background màu trung tính trên badge */
  surfaceNeutral: string;
  /** Được sử dụng cho background màu trung tính trong trạng thái hover trên badge */
  surfaceNeutralHovered: string;
  /** For use as a pressed background color in neutral badges.*/
  surfaceNeutralPressed: string;
  /** For use as a disabled background color in neutral badges.*/
  surfaceNeutralDisabled: string;
  /** For use as a background color in neutral banners.*/
  surfaceNeutralSubdued: string;
  /** For use as a dark background color in neutral banners.*/
  surfaceNeutralSubduedDark: string;
  /** background success banners.*/
  surfaceNeutralSuccess: string;
  /** background critical banner.*/
  surfaceNeutralCritical: string;
  /** background information banner.*/
  surfaceNeutralInfo: string;
  /** background warning banner.*/
  surfaceNeutralWarning: string;
  /** For use as a background color, in components on surface elements such as SearchField*/
  surfaceSearchField: string;
  /** For use as a dark background color, in components on surface elements such as SearchField*/
  surfaceSearchFieldDark: string;
  /** For use as the background color of the backdrop component for navigation and modal. This color has an alpha of `0.5`. */
  backdrop: string;
  /** For use as the background color of elements which lay on top of surfaces to obscure their contents. This color has an alpha of `0.5`. */
  overlay: string;
  /***/
  shadowColorPicker: string;
  /***/
  shadowColorPickerDragger: string;
  /** For use in building shadows scrollables.*/
  hintFromDirectLight: string;
  /** Sử dụng cho đường viền mặc định */
  border: string;
  /** Sử dụng cho đường viền tối hơn mặc định */
  borderDarker: string;
  /** Sử dụng cho đường viền mặc định trong dark mode */
  borderOnDark: string;
  /** Sử dụng border trung tính trạng thái subdued */
  borderNeutralSubdued: string;
  /** Used for borders on hovered interactive elements*/
  borderHovered: string;
  /** Sử dụng cho border trạng thái disable của các phần tử tương tác */
  borderDisabled: string;
  /** Sử dụng cho border tối hơn trạng thái disable của các phần tử tương tác */
  borderDisabledDarker: string;
  /** Sử dụng cho đường viền màu dịu */
  borderSubdued: string;
  /** For use as a border on depressed elements. */
  borderDepressed: string;
  /** For use as an additional bottom border on elements.*/
  borderShadow: string;
  /** For use as an additional, subdued bottom border on elements. */
  borderShadowSubdued: string;
  /** Dùng cho đường viền ngăn cách các phần tử */
  divider: string;
  /** Dùng cho đường viền ngăn cách các phần tử trong dark mode */
  dividerDark: string;
  /** Sử dụng cho màu icon */
  icon: string;
  /** Sử dụng cho màu icon trong dark mode */
  iconOnDark: string;
  /** Sử dụng cho màu icon khi được hover */
  iconHovered: string;
  /** Sử dụng cho màu icon khi được press */
  iconPressed: string;
  /** Sử dụng cho màu icon khi được disable */
  iconDisabled: string;
  /** Sử dụng cho màu icon khi được subdued */
  iconSubdued: string;
  /** Sử dụng cho màu chữ */
  text: string;
  /** For use as a text color on dark elements.*/
  textOnDark: string;
  /** Sử dụng cho màu text diabled.*/
  textDisabled: string;
  /** Sử dụng cho màu text slim như tiêu đề của text field, select.*/
  textSlim: string;
  /** Sử dụng cho màu text subdued.*/
  textSubdued: string;
  /** Sử dụng cho màu text placeholder.*/
  textPlaceholder: string;
  /***/
  textSubduedOnDark: string;
  /** Sử dụng cho links, plain buttons, và fill color cho selected checkboxes hoặc radio buttons. */
  interactive: string;
  /** Sử dụng trong dark mode cho links, plain buttons, và fill color cho selected checkboxes hoặc radio buttons */
  interactiveOnDark: string;
  /** Sử dụng ở trạng thái disable cho links, plain buttons, và fill color cho selected checkboxes hoặc radio buttons */
  interactiveDisabled: string;
  /** Sử dụng ở trạng thái hover cho links, plain buttons, và fill color cho selected checkboxes hoặc radio buttons */
  interactiveHovered: string;
  /** Sử dụng ở trạng thái press cho links, plain buttons, và fill color cho selected checkboxes hoặc radio buttons */
  interactivePressed: string;
  /** Sử dụng trong dark mode ở trạng thái press cho links, plain buttons, và fill color cho selected checkboxes hoặc radio buttons */
  interactivePressedOnDark: string;
  /***/
  focused: string;
  /** Sử dụng cho surface color cho các đối tượng có tính tương tác như ResourceList và các action khi được chọn */
  surfaceSelected: string;
  /** Sử dụng cho surface color cho các đối tượng có tính tương tác như ResourceList và các action khi được chọn và hover */
  surfaceSelectedHovered: string;
  /** Sử dụng cho surface color cho các đối tượng có tính tương tác như ResourceList và các action khi được chọn và press */
  surfaceSelectedPressed: string;
  /***/
  iconOnInteractive: string;
  /***/
  textOnInteractive: string;
  /** Sử dụng cho background của secondary action */
  actionSecondary: string;
  /** Sử dụng khi secondary action bị disabled */
  actionSecondaryDisabled: string;
  /** Sử dụng khi secondary action được hover */
  actionSecondaryHovered: string;
  /** Sử dụng khi secondary action được press */
  actionSecondaryPressed: string;
  /***/
  actionSecondaryDepressed: string;
  /** Sử dụng cho background của primary action và fill color của icons và text color của phần điều hướng, tabs */
  actionPrimary: string;
  /** Sử dụng cho background trong trạng thái disable của primary action và fill color của icons và text color của phần điều hướng, tabs */
  actionPrimaryDisabled: string;
  /** Sử dụng cho background trong trạng thái hover của primary action và fill color của icons và text color của phần điều hướng, tabs */
  actionPrimaryHovered: string;
  /** Sử dụng cho background trong trạng thái press của primary action và fill color của icons và text color của phần điều hướng, tabs */
  actionPrimaryPressed: string;
  /***/
  actionPrimaryDepressed: string;
  /** Sử dụng cho background của primary outline action */
  actionPrimaryOutline: string;
  /** Sử dụng cho background trong trạng thái hover của primary outline action */
  actionPrimaryOutlineHovered: string;
  /** Sử dụng cho background trong trạng thái press của primary outline action */
  actionPrimaryOutlinePressed: string;
  /***/
  iconOnPrimary: string;
  /** Sử dụng cho màu chữ trên primary action */
  textOnPrimary: string;
  /** Sử dụng cho màu chữ primary */
  textPrimary: string;
  /** Sử dụng cho màu chữ primary trong trạng thái hover */
  textPrimaryHovered: string;
  /** Sử dụng cho màu chữ primary trong trạng thái press */
  textPrimaryPressed: string;
  /** Sử dụng cho màu primary selected surface */
  surfacePrimarySelected: string;
  /** Sử dụng cho màu primary selected surface trong trạng thái hovered */
  surfacePrimarySelectedHovered: string;
  /** Sử dụng cho màu primary selected surface trong trạng thái pressed */
  surfacePrimarySelectedPressed: string;
  /** Được sử dụng cho đường viền trên đối tượng tương tác đang focus */
  borderInteractiveFocus: string;
  /** Được sử dụng cho đường viền trên đối tượng mô tả thông tin chẳng hạn như text input */
  borderInformation: string;
  /** Được sử dụng cho đường viền trên đối tượng mô tả khẩn cấp chẳng hạn như text input */
  borderCritical: string;
  /***/
  borderCriticalSubdued: string;
  /***/
  borderCriticalDisabled: string;
  /** Sử dụng cho màu icon nằm trên các đối tượng mô tả khẩn cấp */
  iconCritical: string;
  /** Sử dụng màu surface trên các đối tượng mô tả sự khẩn cấp bao gồm badge */
  surfaceCritical: string;
  /** Sử dụng cho màu subdued surface trong trạng thái critical */
  surfaceCriticalSubdued: string;
  /** Sử dụng cho màu subdued surface trong trạng thái critical khi hover */
  surfaceCriticalSubduedHovered: string;
  /** Sử dụng cho màu subdued surface trong trạng thái critical khi press */
  surfaceCriticalSubduedPressed: string;
  /***/
  surfaceCriticalSubduedDepressed: string;
  /** Sử dụng cho màu chữ critical */
  textCritical: string;
  /** Sử dụng cho background của critical action và cho error toast message */
  actionCritical: string;
  /** Sử dụng cho background trong trạng thái disable của critical action và cho error toast message */
  actionCriticalDisabled: string;
  /** Sử dụng cho background trong trạng thái hover của critical action và cho error toast message */
  actionCriticalHovered: string;
  /** Sử dụng cho background trong trạng thái press của critical action và cho error toast message */
  actionCriticalPressed: string;
  /***/
  actionCriticalDepressed: string;
  /** Sử dụng cho background của critical outline action */
  actionCriticalOutline: string;
  /** Sử dụng cho background trong trạng thái hover của critical outline action */
  actionCriticalOutlineHovered: string;
  /** Sử dụng cho background trong trạng thái press của critical outline action */
  actionCriticalOutlinePressed: string;
  /***/
  iconOnCritical: string;
  /** Sử dụng cho màu chữ trên critical action */
  textOnCritical: string;
  /** Sử dụng cho đối tượng dạng interactive trong trạng thái critical */
  interactiveCritical: string;
  /***/
  interactiveCriticalDisabled: string;
  /***/
  interactiveCriticalHovered: string;
  /***/
  interactiveCriticalPressed: string;
  /** Được sử dụng cho đường viền trên đối tượng mô tả cảnh báo chẳng hạn như text input */
  borderWarning: string;
  /***/
  borderWarningSubdued: string;
  /** Sử dụng cho màu icon nằm trên các đối tượng mô tả cảnh báo */
  iconWarning: string;
  /** Sử dụng màu surface trên các đối tượng mô tả cảnh báo bao gồm badge */
  surfaceWarning: string;
  /***/
  surfaceWarningSubdued: string;
  /***/
  surfaceWarningSubduedHovered: string;
  /***/
  surfaceWarningSubduedPressed: string;
  /** Sử dụng cho màu chữ warning*/
  textWarning: string;
  /** Được sử dụng cho đường viền trên đối tượng highlight */
  borderHighlight: string;
  /***/
  borderHighlightSubdued: string;
  /***/
  iconHighlight: string;
  /** Sử dụng màu surface trên các đối tượng mô tả thông tin bao gồm badge */
  surfaceHighlight: string;
  /***/
  surfaceHighlightSubdued: string;
  /***/
  surfaceHighlightSubduedHovered: string;
  /***/
  surfaceHighlightSubduedPressed: string;
  /** Sử dụng cho màu chữ highlight */
  textHighlight: string;
  /** Được sử dụng cho đường viền trên đối tượng mô tả thành công chẳng hạn như text input */
  borderSuccess: string;
  /***/
  borderSuccessSubdued: string;
  /** Sử dụng cho màu icon nằm trên các đối tượng mô tả thành công */
  iconSuccess: string;
  /** Sử dụng màu surface trên các đối tượng mô tả thành công bao gồm badge */
  surfaceSuccess: string;
  /***/
  surfaceSuccessSubdued: string;
  /***/
  surfaceSuccessSubduedHovered: string;
  /***/
  surfaceSuccessSubduedPressed: string;
  /** Màu text success*/
  textSuccess: string;
  /***/
  iconAttention: string;
  /** Sử dụng màu surface trên các đối tượng mô tả sự chú ý bao gồm badge */
  surfaceAttention: string;
  /***/
  decorativeOneIcon: string;
  /***/
  decorativeOneSurface: string;
  /***/
  decorativeOneText: string;
  /***/
  decorativeTwoIcon: string;
  /***/
  decorativeTwoSurface: string;
  /***/
  decorativeTwoText: string;
  /***/
  decorativeThreeIcon: string;
  /***/
  decorativeThreeSurface: string;
  /***/
  decorativeThreeText: string;
  /***/
  decorativeFourIcon: string;
  /***/
  decorativeFourSurface: string;
  /***/
  decorativeFourText: string;
  /***/
  decorativeFiveIcon: string;
  /***/
  decorativeFiveSurface: string;
  /***/
  decorativeFiveText: string;
  /***/
  decorativeSixIcon: string;
  /***/
  decorativeSixSurface: string;
  /***/
  decorativeSixText: string;
}

interface ThemeColorDarkTokens {
  /** For use as a dark background color, in components such as Card, Modal, and Popover. */
  surfaceDark: string;
  /** Sử dụng khi secondary button được hover trong dark mode */
  actionSecondaryHoveredDark: string;
  /** Sử dụng khi secondary button được press trong dark mode */
  actionSecondaryPressedDark: string;
}

export interface ThemeColorTokens extends ThemeColorCommonTokens, ThemeColorDarkTokens {}

export type ThemeColors = ThemeColorCommonTokens & {
  mode: ThemeColorsMode;
};

export type ThemeColorsInput = Partial<ThemeColorTokens & Pick<ThemeColors, "mode">>;

export function createColors(colors: ThemeColorsInput): ThemeColors {
  const base = defaultColorTokens;
  const { mode: inputColorMode, ...other } = colors;
  const colorTokens = merge(base, other) as ThemeColorTokens;
  const mode: ThemeColorsMode = inputColorMode || "light";
  const { surfaceDark, actionSecondaryHoveredDark, actionSecondaryPressedDark, ...otherTokens } = colorTokens;
  otherTokens.surface = mode === "dark" ? surfaceDark : otherTokens.surface;
  otherTokens.actionSecondaryHovered =
    mode === "dark" ? actionSecondaryHoveredDark : otherTokens.actionSecondaryHovered;
  otherTokens.actionSecondaryPressed =
    mode === "dark" ? actionSecondaryPressedDark : otherTokens.actionSecondaryPressed;
  return {
    mode,
    ...otherTokens,
  };
}
