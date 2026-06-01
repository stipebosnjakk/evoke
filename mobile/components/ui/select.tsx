import { Icon } from "@/components/ui/icon";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as SelectPrimitive from "@rn-primitives/select";
import {
  Check,
  ChevronDown,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react-native";
import * as React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

const SELECT_ITEM_HEIGHT = 44;
const SELECT_LABEL_HEIGHT = 34;
const SELECT_CONTENT_PADDING = 16;
const SELECT_MAX_VISIBLE_ITEMS = 3;
const SELECT_VIEWPORT_MAX_HEIGHT =
  SELECT_ITEM_HEIGHT * SELECT_MAX_VISIBLE_ITEMS + SELECT_LABEL_HEIGHT;
const SELECT_MAX_HEIGHT = SELECT_VIEWPORT_MAX_HEIGHT + SELECT_CONTENT_PADDING;

type Option = SelectPrimitive.Option;

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;

function SelectValue({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value> & {
  className?: string;
}) {
  const { value } = SelectPrimitive.useRootContext();

  return (
    <SelectPrimitive.Value
      ref={ref}
      numberOfLines={1}
      ellipsizeMode="tail"
      className={cn(
        "min-w-0 flex-1 line-clamp-1 text-[15px] font-medium text-[#18181B]",
        !value && "text-[#A1A1AA]",
        className,
      )}
      {...props}
    />
  );
}

function SelectTrigger({
  ref,
  className,
  children,
  size = "default",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  children?: React.ReactNode;
  size?: "default" | "sm";
}) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-11 flex-row items-center justify-between gap-2 rounded-xl border border-[#E4E4E7] bg-white px-3",
        Platform.select({
          web: "focus-visible:border-[#D4D4D8] focus-visible:ring-[#E4E4E7]/80 w-fit whitespace-nowrap text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
        }),
        props.disabled && "opacity-50",
        size === "sm" && "h-9 px-3",
        className,
      )}
      {...props}
    >
      <>{children}</>
      <Icon
        as={ChevronDown}
        aria-hidden={true}
        className="size-4 text-[#71717A]"
      />
    </SelectPrimitive.Trigger>
  );
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

function SelectContent({
  className,
  children,
  position = "popper",
  portalHost,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  className?: string;
  portalHost?: string;
}) {
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <SelectPrimitive.Overlay
          style={Platform.select({ native: StyleSheet.absoluteFill })}
        >
          <NativeOnlyAnimatedView
            className="z-50"
            entering={FadeIn.duration(120)}
            exiting={FadeOut.duration(80)}
          >
            <TextClassContext.Provider value="text-[#3F3F46]">
              <SelectPrimitive.Content
                style={StyleSheet.flatten([
                  { maxHeight: SELECT_MAX_HEIGHT },
                  style,
                ])}
                className={cn(
                  "relative z-50 min-w-[8rem] overflow-hidden rounded-[22px] border border-[#EFEFEF] bg-white p-2",
                  Platform.select({
                    web: cn(
                      "animate-in fade-in-0 zoom-in-95 overflow-y-auto overflow-x-hidden origin-(--radix-select-content-transform-origin) cursor-default",
                      props.side === "bottom" && "slide-in-from-top-2",
                      props.side === "top" && "slide-in-from-bottom-2",
                    ),
                  }),
                  className,
                )}
                position={position}
                {...props}
              >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                  className={cn(
                    "p-0",
                    position === "popper" &&
                      Platform.select({
                        web: "w-full min-w-[var(--radix-select-trigger-width)]",
                      }),
                  )}
                >
                  <ScrollView
                    style={{ maxHeight: SELECT_VIEWPORT_MAX_HEIGHT }}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                    persistentScrollbar={Platform.OS === "android"}
                    indicatorStyle="black"
                    scrollIndicatorInsets={{ right: 1 }}
                    keyboardShouldPersistTaps="handled"
                  >
                    {children}
                  </ScrollView>
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
              </SelectPrimitive.Content>
            </TextClassContext.Provider>
          </NativeOnlyAnimatedView>
        </SelectPrimitive.Overlay>
      </FullWindowOverlay>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn(
        "px-3 pb-1.5 pt-2 text-[13px] font-medium text-[#71717A]",
        className,
      )}
      {...props}
    />
  );
}

type SelectItemProps = Omit<
  React.ComponentProps<typeof SelectPrimitive.Item>,
  "children"
> & {
  children?: React.ReactNode;
};

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "active:bg-[#F4F4F5] group relative flex min-h-11 w-full flex-row items-center gap-2 rounded-xl py-2.5 pl-1 pr-8",
        Platform.select({
          web: "focus:bg-[#F4F4F5] focus:text-[#18181B] cursor-default outline-none data-[disabled]:pointer-events-none [&_svg]:pointer-events-none",
        }),
        props.disabled && "opacity-50",
        className,
      )}
      android_ripple={
        Platform.OS === "android"
          ? { color: "rgba(244,244,245,0.95)", borderless: false }
          : undefined
      }
      {...props}
    >
      {children ? (
        children
      ) : (
        <SelectPrimitive.ItemText
          numberOfLines={1}
          ellipsizeMode="tail"
          className="min-w-0 flex-1 select-none text-[15px] font-medium text-[#3F3F46] group-active:text-[#18181B]"
        />
      )}
      <View className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon as={Check} className="size-4 shrink-0 text-[#18181B]" />
        </SelectPrimitive.ItemIndicator>
      </View>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn("mx-1.5 my-1.5 h-px bg-[#EFEFEF]", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  if (Platform.OS !== "web") return null;

  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <Icon as={ChevronUpIcon} className="size-4 text-[#71717A]" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  if (Platform.OS !== "web") return null;

  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <Icon as={ChevronDownIcon} className="size-4 text-[#71717A]" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type Option,
};
