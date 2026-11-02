/* ===== Tema ===== */
export {
  AuraProvider,
  useAura,
  isDarkTheme,
  type AuraProviderProps,
  type AuraTheme,
  type AuraThemeName,
  type AuraMode,
  type AuraOverrides,
  type GradientComponent,
  type BlurComponent
} from "./theme/provider";
export { makeStyles, useStyles } from "./theme/styles";
export { alpha, resolveColor } from "./theme/color";
export {
  space,
  SPACE_UNIT,
  textVariants,
  type RadiusToken,
  type ShadowLevel,
  type TextVariant,
  type FontWeightToken
} from "./theme/tokens";
export {
  AURA_THEMES,
  AURA_DARK_THEMES,
  AURA_THEME_LABELS,
  PALETTES
} from "./theme/palettes.generated";
export type { ColorToken, ColorTokens, GradientName, GradientSpec, Palette } from "./theme/types";

/* ===== Layout ===== */
export {
  Box,
  Stack,
  VStack,
  HStack,
  Spacer,
  Divider,
  Screen,
  boxStyle,
  type BoxProps,
  type BoxStyleProps,
  type StackProps,
  type DividerProps,
  type ScreenProps
} from "./components/layout";
export {
  Text,
  Heading,
  textStyle,
  type TextProps,
  type HeadingProps,
  type TextTone
} from "./components/text";
export {
  Gradient,
  Glass,
  angleToPoints,
  type GradientProps,
  type GlassProps
} from "./components/surfaces";
export { PressableScale, type PressableScaleProps } from "./components/pressable";

/* ===== Ações ===== */
export {
  Button,
  IconButton,
  buttonColors,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
  type IconButtonProps
} from "./components/button";

/* ===== Formulários ===== */
export {
  Input,
  TextArea,
  INPUT_SIZES,
  type InputProps,
  type TextAreaProps,
  type InputSize,
  type InputVariant,
  type InputRef
} from "./components/input";
export { Switch, type SwitchProps, type SwitchSize, type SwitchVariant } from "./components/switch";
export {
  Checkbox,
  type CheckboxProps,
  type CheckboxChecked,
  type CheckboxSize
} from "./components/checkbox";
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioGroupItemProps,
  type RadioSize,
  type RadioVariant
} from "./components/radio";
export {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedControlOption,
  type SegmentedControlSize
} from "./components/segmented-control";
export {
  Chip,
  ChipGroup,
  type ChipProps,
  type ChipVariant,
  type ChipSize,
  type ChipGroupProps,
  type ChipGroupSingleProps,
  type ChipGroupMultipleProps
} from "./components/chip";
export { OTPInput, type OTPInputProps, type OTPInputSize } from "./components/otp-input";

/* ===== Exibição ===== */
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardVariant,
  type CardPadding
} from "./components/card";
export {
  Badge,
  badgeColors,
  type BadgeProps,
  type BadgeVariant,
  type BadgeSize
} from "./components/badge";
export {
  Avatar,
  AvatarGroup,
  getInitials,
  type AvatarProps,
  type AvatarGroupProps,
  type AvatarSize,
  type AvatarShape,
  type AvatarStatus
} from "./components/avatar";
export {
  Alert,
  StatusIcon,
  type AlertProps,
  type AlertVariant,
  type StatusIconProps,
  type StatusTone
} from "./components/alert";
export {
  Progress,
  Spinner,
  Skeleton,
  type ProgressProps,
  type ProgressTone,
  type ProgressSize,
  type SpinnerProps,
  type SpinnerTone,
  type SkeletonProps
} from "./components/progress";
export {
  ListItem,
  ListSection,
  type ListItemProps,
  type ListSectionProps
} from "./components/list-item";
export { EmptyState, type EmptyStateProps, type EmptyStateAction } from "./components/empty-state";

/* ===== Overlays ===== */
export { Dialog, AlertDialog, type DialogProps, type AlertDialogProps } from "./components/dialog";
export { BottomSheet, type BottomSheetProps } from "./components/bottom-sheet";
export {
  ActionSheet,
  type ActionSheetProps,
  type ActionSheetAction
} from "./components/action-sheet";
export { Select, type SelectProps, type SelectOption, type SelectValue } from "./components/select";
export {
  ToastProvider,
  useToast,
  type ToastProviderProps,
  type ToastOptions,
  type ToastShortcutOptions,
  type ToastFn,
  type ToastApi,
  type ToastVariant,
  type ToastPosition,
  type ToastAction
} from "./components/toast";
