import { Container, Box, Heading, Grid } from "@chakra-ui/react";
import React from "react";

interface AboutProps {}

export const About: React.FC<AboutProps> = () => {
  return (
    <Container w={"full"} centerContent>
      <Box h={"10"} />
      <Box w={"container.xl"}>
        <Heading mb={"4"}>About</Heading>
        <Box h={"2"} />
        <Grid templateColumns="repeat(2, 1fr)" gap={6}></Grid>
      </Box>
    </Container>
  );
};
