//boilerplate for nextjs page
import React, { useContext, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Affix,
  Container,
  Image,
  Title,
  Text,
  createStyles,
  Popover,
  Button,
  Flex,
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
    <Container p={10} h="95vh">
      <Title order={1} color="red" align="center" mb={10}>
        Astronomy Picture of the Day ({nasaImage?.date})
      </Title>
      <Flex justify="center" align="center">
        <Image src={nasaImage?.url} alt={nasaImage?.title} radius="md" />
      </Flex>

      <Affix position={{ bottom: 10, right: 10 }}>
        <Popover position="top" withArrow shadow="md" width={600}>
          <Popover.Target>
            <Button>More Info</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Title order={2} color="red" underline>
              {nasaImage?.title}
            </Title>
            <Text size={11}>{nasaImage?.explanation}</Text>
          </Popover.Dropdown>
        </Popover>
      </Affix>
    </Container>
  );
};

export default Home;
