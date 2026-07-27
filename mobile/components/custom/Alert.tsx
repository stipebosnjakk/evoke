import { StyleSheet } from "react-native";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Text } from "@/components/ui/text";

type AlertType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: string;
  onAction?: () => void;
  actionLabel?: string;
  buttonVariant?: "default" | "destructive";
};

const Alert = ({
  open,
  onOpenChange,
  title,
  subtitle,
  onAction,
  actionLabel = "Continue",
  buttonVariant = "default",
}: AlertType) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} style={styles.root}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{subtitle}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={() => onOpenChange(false)}>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction
            className={
              buttonVariant === "destructive"
                ? "bg-destructive active:bg-destructive/90"
                : undefined
            }
            onPress={onAction}
          >
            <Text>{actionLabel}</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    width: 0,
    height: 0,
  },
});

export default Alert;
