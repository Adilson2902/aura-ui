export { Button, buttonVariants, type ButtonProps } from "./button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  cardVariants,
  type CardProps
} from "./card";
export {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarLink,
  NavbarAction,
  navbarVariants,
  type NavbarProps,
  type NavbarLinkProps
} from "./navbar";
export { Input, inputVariants, type InputProps } from "./input";
export { Textarea, textareaVariants, type TextareaProps } from "./textarea";
export { Separator, separatorVariants, type SeparatorProps } from "./separator";
export { Skeleton, skeletonVariants, type SkeletonProps } from "./skeleton";
export { DataTable, type DataTableColumn, type DataTableProps } from "./data-table";
export { Badge, badgeVariants, type BadgeProps } from "./badge";
export { Label } from "./label";
export { Switch, switchVariants, type SwitchProps } from "./switch";
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
  type TabsListProps
} from "./tabs";
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  dialogContentVariants,
  type DialogContentProps
} from "./dialog";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
  tooltipVariants,
  type TooltipContentProps
} from "./tooltip";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  selectTriggerVariants,
  type SelectTriggerProps
} from "./select";

/* ===== Toolspace-parity + extras 3D ===== */
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
  accordionItemVariants
} from "./accordion";
export { Alert, AlertTitle, AlertDescription, alertVariants, type AlertProps } from "./alert";
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  avatarVariants,
  type AvatarGroupProps
} from "./avatar";
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from "./breadcrumb";
export { Checkbox, checkboxVariants, type CheckboxProps } from "./checkbox";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup
} from "./dropdown-menu";
export { EmptyState, type EmptyStateProps } from "./empty-state";
export { Kbd, kbdVariants, type KbdProps } from "./kbd";
export { Pagination, type PaginationProps } from "./pagination";
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
  popoverVariants,
  type PopoverContentProps
} from "./popover";
export { Progress, progressVariants, type ProgressProps } from "./progress";
export {
  RadioGroup,
  RadioGroupItem,
  RadioGroupCard,
  radioItemVariants,
  type RadioGroupItemProps
} from "./radio-group";
export { ScrollArea, ScrollBar } from "./scroll-area";
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  sheetVariants,
  type SheetContentProps
} from "./sheet";
export { Slider } from "./slider";
export { Spinner, spinnerVariants, type SpinnerProps } from "./spinner";
export { Stat, type StatProps } from "./stat";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableVariants,
  type TableProps
} from "./table";
export {
  Toast,
  ToastProvider,
  useToast,
  toastVariants,
  type ToastProps,
  type ToastItem,
  type ToastAction,
  type ToastFn,
  type ToastPosition,
  type ToastContextValue,
  type ToastProviderProps
} from "./toast";

/* ===== Charts + Themes ===== */
export {
  ChartFrame,
  BarChart,
  LineChart,
  MultiLineChart,
  DonutChart,
  Sparkline,
  RadialProgress,
  type ChartDatum,
  type ChartSeries,
  type ChartFrameProps,
  type BarChartProps,
  type LineChartProps,
  type MultiLineChartProps,
  type DonutChartProps,
  type SparklineProps,
  type RadialProgressProps
} from "./charts";
export { ThemeSwitcher, type ThemeSwitcherProps } from "./theme-switcher";

/* ===== Blocos de página (criação rápida de sites) ===== */
export {
  Container,
  Section,
  SectionHeading,
  containerVariants,
  sectionVariants,
  type ContainerProps,
  type SectionProps,
  type SectionHeadingProps
} from "./section";
export {
  Hero,
  HeroContent,
  HeroEyebrow,
  HeroTitle,
  HeroSubtitle,
  HeroActions,
  heroVariants,
  type HeroProps,
  type HeroTitleProps,
  type HeroEyebrowProps
} from "./hero";
export { CallToAction, ctaVariants, type CallToActionProps } from "./cta";
export {
  FeatureGrid,
  FeatureCard,
  featureGridVariants,
  featureCardVariants,
  type FeatureGridProps,
  type FeatureCardProps
} from "./feature-grid";
export {
  PricingCard,
  PricingGrid,
  pricingVariants,
  type PricingCardProps
} from "./pricing";
export {
  Footer,
  FooterGrid,
  FooterBrand,
  FooterColumn,
  FooterLink,
  FooterBottom,
  footerVariants,
  type FooterProps,
  type FooterBrandProps,
  type FooterColumnProps,
  type FooterLinkProps,
  type FooterBottomProps
} from "./footer";
export {
  Sidebar,
  SidebarItem,
  SidebarLabel,
  AppShell,
  sidebarVariants,
  type SidebarProps,
  type SidebarItemProps,
  type AppShellProps
} from "./sidebar";
export {
  Timeline,
  TimelineItem,
  timelineVariants,
  type TimelineProps,
  type TimelineItemProps
} from "./timeline";
export { Steps, stepsVariants, type StepsProps, type StepItem } from "./steps";
export { Rating, ratingVariants, type RatingProps } from "./rating";
export {
  TagsInput,
  tagsInputVariants,
  tagVariants,
  type TagsInputProps
} from "./tags-input";
export { Meter, meterTrackVariants, meterFillVariants, type MeterProps } from "./meter";
export {
  CodeBlock,
  codeBlockVariants,
  type CodeBlockProps
} from "./code-block";
export {
  Blockquote,
  blockquoteVariants,
  type BlockquoteProps
} from "./blockquote";
export {
  Toggle,
  ToggleGroup,
  toggleVariants,
  type ToggleProps,
  type ToggleGroupProps
} from "./toggle";

/* ===== v3 — overlays, comandos, formulários, datas e blocos ===== */
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  alertDialogContentVariants,
  type AlertDialogContentProps
} from "./alert-dialog";
export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  hoverCardVariants,
  type HoverCardContentProps
} from "./hover-card";
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup
} from "./context-menu";
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  commandVariants,
  type CommandProps,
  type CommandDialogProps
} from "./command";
export {
  Combobox,
  type ComboboxOption,
  type ComboboxProps,
  type ComboboxSingleProps,
  type ComboboxMultipleProps
} from "./combobox";
export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  drawerVariants,
  type DrawerContentProps
} from "./drawer";
export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  fieldVariants,
  useField,
  type FieldProps,
  type FieldLabelProps,
  type FieldErrorProps,
  type FieldSetProps
} from "./field";
export {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupButton,
  inputGroupVariants,
  inputGroupAddonVariants,
  inputGroupButtonVariants,
  type InputGroupProps,
  type InputGroupAddonProps,
  type InputGroupButtonProps
} from "./input-group";
export { InputOTP, inputOTPSlotVariants, type InputOTPProps } from "./input-otp";
export { NumberInput, numberInputVariants, type NumberInputProps } from "./number-input";
export {
  FileUpload,
  FileUploadList,
  FileUploadItem,
  fileUploadVariants,
  type FileUploadProps,
  type FileUploadItemProps,
  type FileRejection,
  type FileRejectionReason
} from "./file-upload";
export {
  Calendar,
  calendarVariants,
  type CalendarProps,
  type CalendarSingleProps,
  type CalendarRangeProps,
  type DateRange
} from "./calendar";
export {
  DatePicker,
  DateRangePicker,
  datePickerTriggerVariants,
  type DatePickerProps,
  type DateRangePickerProps
} from "./date-picker";
export {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
  buttonGroupVariants,
  type ButtonGroupProps
} from "./button-group";
export { AspectRatio, type AspectRatioProps } from "./aspect-ratio";
export { CopyButton, type CopyButtonProps } from "./copy-button";
export {
  Heading,
  Text,
  InlineCode,
  Prose,
  headingVariants,
  textVariants,
  type HeadingProps,
  type TextProps
} from "./typography";
export { Banner, bannerVariants, type BannerProps } from "./banner";
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  carouselContentVariants,
  useCarousel,
  type CarouselProps,
  type CarouselContentProps,
  type CarouselItemProps
} from "./carousel";
export {
  TestimonialCard,
  TestimonialGrid,
  testimonialVariants,
  testimonialGridVariants,
  type TestimonialCardProps,
  type TestimonialGridProps
} from "./testimonial";
export { LogoCloud, logoCloudVariants, type LogoCloudProps } from "./logo-cloud";
