//boilerplate for nextjs page
import React, { useContext, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Affix,
  Card,
  Container,
  Image,
  Title,
  Text,
  createStyles,
  Stack,
} from "@mantine/core";
import { AuthContext } from "../components/contexts/authContext";

const useStyles = createStyles(() => ({
  image_info: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#000",
  },
}));

const Home: NextPage = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [nasaImage, setNasaImage] = React.useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/nasaimage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    }).then((res) => {
      res.json().then((data) => {
        setNasaImage(data);
      });
    });
  }, []);

  return (
    <Container p={10}>
      <Container h={"100%"}>
        <Image src={nasaImage?.url} alt={nasaImage?.title} radius="md" />
      </Container>

      <Affix position={{ bottom: 10, left: 10 }}>
        <Container className={classes.image_info}>
          <Title order={2} color="red">
            {nasaImage?.title}
          </Title>
          <Text size={11}>{nasaImage?.explanation}</Text>
        </Container>
      </Affix>

      <Affix position={{ bottom: 10, right: 10 }}>
        <Stack></Stack>
      </Affix>
    </Container>
  );
};

export default Home;
