import moment from "moment";
import { AlertDialog } from "native-base";
import React, { CSSProperties, useMemo, useRef, useState } from "react";

//@ts-ignore
import DatePickerModern from "react-native-modern-datepicker";
import { gregorianConfigsPortuguese } from "./configs";

type DatePickerProps = {
  isOpen: boolean;
  onClose: () => any;
  mode?: "datepicker" | "calendar" | "monthYear" | "time";
  current?: Date;
  selectorStartingYear?: number;

  onSelectedChange?: (dateString: string) => void;
  onMonthYearChange?: (dateString: string) => void;
  onTimeChange?: (dateString: string) => void;
  onDateChange?: (dateString: string) => void;
  minimumDate?: string;
  maximumDate?: string;
  selectorEndingYear?: number;
  disableDateChange?: boolean;
  isGregorian?: boolean;
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30 | 60;
  style?: CSSProperties;
  selected?: string;
  locale?: string;
  options?: {
    backgroundColor?: string;
    textHeaderColor?: string;
    textDefaultColor?: string;
    selectedTextColor?: string;
    mainColor?: string;
    textSecondaryColor?: string;
    borderColor?: string;
    defaultFont?: string;
    headerFont?: string;
    textFontSize?: number;
    textHeaderFontSize?: number;
    headerAnimationDistance?: number;
    daysAnimationDistance?: number;
  };
};
export const DatePicker: React.FC<DatePickerProps> = ({
  isOpen,
  onClose,
  mode,
  selectorStartingYear,
  onMonthYearChange,
  current,
  ...props
}) => {
  const cancelRef = useRef();

  const [currentDate, setCurrentDate] = useState(current ?? new Date());

  const currentDateString = useMemo(() => {
    return moment(currentDate).format("YYYY/MM/DD");
  }, [currentDate]);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialog.Content width={350}>
        <AlertDialog.Body>
          <DatePickerModern
            mode={mode ?? "monthYear"}
            selectorStartingYear={selectorStartingYear ?? 2000}
            //@ts-ignore
            configs={gregorianConfigsPortuguese}
            current={currentDateString}
            onMonthYearChange={(selectedDate) => {
              setCurrentDate(
                moment(`${selectedDate.replace(" ", "-")}-01`).toDate()
              );
              onMonthYearChange(selectedDate);
              onClose();
            }}
            {...props}
          />
        </AlertDialog.Body>
      </AlertDialog.Content>
    </AlertDialog>
  );
};
