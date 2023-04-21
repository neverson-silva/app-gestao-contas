import React, { useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  useTheme,
  Box,
  HStack,
  Heading,
  Icon,
  VStack,
  Divider,
} from "native-base";
import { SafeAreaView, Animated, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@contexts/auth/useAuth";
import { Card } from "@components/Card";

const Header_Max_Height = 180;
const Header_Min_Height = 50;

type HomeHeaderProps = {
  scrollOffsetY: Animated.Value;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({ scrollOffsetY }) => {
  const { colors } = useTheme();

  const {
    usuario: { pessoa },
  } = useAuth();

  const animateHeaderBackgroundColor = scrollOffsetY.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [colors.primary[500], colors.primary[500]],
    extrapolate: "clamp",
  });

  const animateHeaderHeight = scrollOffsetY.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: "clamp",
  });

  const animatedCardHeight = scrollOffsetY.interpolate({
    inputRange: [0, 20 - 10],
    outputRange: [20, -10],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        {
          height: animateHeaderHeight,
          // backgroundColor: animateHeaderBackgroundColor,
        },
      ]}
    >
      <Box width={"100%"} p={4}>
        <HStack justifyContent={"space-between"}>
          <Box>
            <Heading size={"md"} color={"white"}>
              {pessoa?.nome}
            </Heading>
          </Box>
          <Box>
            <Pressable onPress={() => console.log("oi mundo")}>
              <Icon as={Feather} name="menu" size={7} color={"white"} />
            </Pressable>
          </Box>
        </HStack>
      </Box>
      <VStack position={"absolute"} top={130} width={"full"} px={3}>
        <Box borderRadius="md" bgColor={"white"} p={4}>
          <VStack space="4" divider={<Divider />}>
            <Box px="4" pt="4">
              NativeBase
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Animated.View>
  );
};
