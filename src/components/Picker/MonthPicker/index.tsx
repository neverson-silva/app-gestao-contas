import { Feather } from "@expo/vector-icons";
import moment from "moment";
import {
  Box,
  Button,
  Divider,
  FlatList,
  HStack,
  IBoxProps,
  IModalProps,
  Icon,
  Modal,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { useState } from "react";

type MonthPickerProps = {
  current?: Date;
  onChangeMonth?: (month: Date) => void;
  onClose?: () => void;
  // onSelectYear?: (year: number) => void;
  modalProps?: IModalProps;
  containerProps?: IBoxProps;
  isOpen: boolean;
  overlay?: boolean;
};

const MONTHS = [
  { name: "Jan", value: 1 },
  { name: "Fev", value: 2 },
  { name: "Mar", value: 3 },
  { name: "Abr", value: 4 },
  { name: "Mai", value: 5 },
  { name: "Jun", value: 6 },
  { name: "Jul", value: 7 },
  { name: "Ago", value: 8 },
  { name: "Set", value: 9 },
  { name: "Out", value: 10 },
  { name: "Nov", value: 11 },
  { name: "Dez", value: 12 },
];

export const MonthPicker: React.FC<MonthPickerProps> = ({
  current,
  onChangeMonth,
  modalProps,
  containerProps,
  isOpen,
  overlay,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    moment(current ?? new Date()).month() + 1
  );
  const [currentYear, setCurrentYear] = useState(
    moment(current ?? new Date()).year()
  );

  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: currentMonth,
    year: currentYear,
  });

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const handleChangeYear = (isNextYear: boolean) => {
    if (isNextYear) {
      setCurrentYear((old) => old + 1);
    } else {
      setCurrentYear((old) => old - 1);
    }
  };

  const isSelected = (month: number, year: number) => {
    return month === selectedMonthYear.month && year === selectedMonthYear.year;
  };

  const handleOnChangeMonth = (
    monthNumber: number,
    buttonPressed?: boolean
  ) => {
    setSelectedMonthYear((old) => ({ year: currentYear, month: monthNumber }));

    if (onChangeMonth) {
      if (overlay && !buttonPressed) {
        return;
      }
      const { month, year } = selectedMonthYear;
      onChangeMonth(
        moment(`${year}-${String(month).padStart(2, "0")}-01`).toDate()
      );
      onClose();
    }
  };

  const renderMonthItem = ({
    item,
    index,
  }: {
    index: number;
    item: { value: number; name: string };
  }) => {
    const selecionado = isSelected(item.value, currentYear);
    return (
      <Pressable
        mx={index % 2 !== 0 ? 5 : 4}
        height={50}
        width={50}
        alignItems="center"
        justifyContent={"center"}
        bgColor={selecionado ? "primary.500" : "transparent"}
        borderRadius={selecionado ? 100 : 0}
        onPress={() => handleOnChangeMonth(item.value, false)}
      >
        <Text color={selecionado ? "white" : "muted.700"}>{item.name}</Text>
      </Pressable>
    );
  };

  const Calendar = () => {
    return (
      <Box {...containerProps}>
        <VStack>
          <HStack
            display={"flex"}
            justifyContent={"space-between"}
            m={1}
            alignItems={"center"}
            alignContent={"center"}
          >
            <Pressable
              p={2}
              ml={2}
              _pressed={{
                bg: "primary.500",
                borderRadius: 90,
              }}
              onPress={() => handleChangeYear(false)}
            >
              {({ isPressed }) => (
                <Icon
                  as={Feather}
                  name="arrow-left"
                  size={"md"}
                  color={!isPressed ? "muted.500" : "white"}
                />
              )}
            </Pressable>
            <Text
              fontSize={"md"}
              fontFamily={"heading"}
              fontWeight={"semibold"}
            >
              {currentYear}
            </Text>
            <Pressable
              p={3}
              mr={2}
              onPress={() => handleChangeYear(true)}
              _pressed={{
                bg: "primary.500",
                borderRadius: 90,
              }}
            >
              {({ isPressed }) => (
                <Icon
                  as={Feather}
                  name="arrow-right"
                  size={"md"}
                  color={!isPressed ? "muted.500" : "white"}
                />
              )}
            </Pressable>
          </HStack>
        </VStack>
        <FlatList
          data={MONTHS}
          keyExtractor={(item) => item.value.toString()}
          numColumns={3}
          display={"flex"}
          renderItem={renderMonthItem}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        />

        {overlay && (
          <HStack
            divider={<Divider />}
            m={4}
            alignItems={"flex-end"}
            justifyContent={"flex-end"}
          >
            <Button.Group space={2}>
              <Button
                variant="ghost"
                size={"lg"}
                colorScheme="blueGray"
                onPress={() => onClose()}
              >
                Cancelar
              </Button>
              <Button
                size={"lg"}
                onPress={() => {
                  handleOnChangeMonth(selectedMonthYear.month, true);
                }}
              >
                Selecioar
              </Button>
            </Button.Group>
          </HStack>
        )}
      </Box>
    );
  };

  return (
    <>
      {overlay && (
        <Modal
          isOpen={isOpen}
          onClose={onChangeMonth}
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          size={"lg"}
          {...modalProps}
        >
          <Modal.Content>
            <Calendar />
          </Modal.Content>
        </Modal>
      )}
      {!overlay && <Calendar />}
    </>
  );
};
