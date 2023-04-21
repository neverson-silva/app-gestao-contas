import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  Center,
  StatusBar,
  useTheme,
  ScrollView,
  Box,
  Container,
  HStack,
  Heading,
  Icon,
  Pressable,
  Image,
  Menu,
  HamburgerIcon,
} from "native-base";

import { ResumoContaMes } from "./components/ResumoContaMes";
import { useAuth } from "@contexts/auth/useAuth";
import { ResumoPessoasList } from "./components/ResumoPessoasList";
import { LogBox, Animated, SafeAreaView } from "react-native";
import { Usuario } from "@models/auth";
import { Feather } from "@expo/vector-icons";
import { HomeHeader } from "./components/HomeHeader";

export const DATA = [
  {
    id: 1,
    title: "Modern JS: A curated collection",
  },
  {
    id: 2,
    title: "JavaScript notes for professionals",
  },
  {
    id: 3,
    title: "JavaScript: The Good Parts",
  },
  {
    id: 4,
    title: "JavaScript: The right way",
  },
  {
    id: 5,
    title: "Exploring ES6",
  },
  {
    id: 6,
    title: "JavaScript Enlightenment",
  },
  {
    id: 7,
    title: "You dont know JS",
  },
  {
    id: 8,
    title: "Learn JavaScript",
  },
  {
    id: 9,
    title: "JavaScript succintly",
  },
  {
    id: 10,
    title: "Human JavaScript",
  },
  {
    id: 11,
    title: "JavaScript design patterns",
  },
  {
    id: 12,
    title: "JS50: 50 illustrations in JS",
  },
  {
    id: 13,
    title: "Eloqent JavaScript",
  },
  {
    id: 14,
    title: "Practical ES6",
  },
  {
    id: 15,
    title: "Speaking JavaScript",
  },
];

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const {
    logout,
    usuario: { pessoa },
  } = useAuth();

  let scrollOffsetY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={colors.primary[500]} />
      <HomeHeader scrollOffsetY={scrollOffsetY} />

      <ScrollView
        style={{
          marginTop: 50,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
      >
        {DATA.map((book, index) => {
          return (
            <Text
              style={{
                fontSize: 19,
                textAlign: "center",
                padding: 20,
                color: "#000",
              }}
              key={book.id}
            >
              {book.title}
            </Text>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );

  // return (
  //   <SafeAreaView>
  //     <StatusBar backgroundColor={colors.secondary[500]} />
  //     <ScrollView m={4}>
  //       <ResumoContaMes />
  //       <ResumoPessoasList />
  //       <Button onPress={logout}>Sair</Button>
  //     </ScrollView>
  //   </SafeAreaView>
  // );
};
