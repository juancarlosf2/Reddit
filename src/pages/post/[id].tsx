import React from "react";
import { withUrqlClient } from "next-urql";
import Layout from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Box, Heading, Text } from "@chakra-ui/core";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";
import { useMeQuery } from "../../generated/graphql";

const Post = () => {
  const [{ data, fetching }] = useGetPostFromUrl();
  const [{ data: meData }] = useMeQuery();
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }
  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find post</Box>
      </Layout>
    );
  }
  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>
        <Text>{data.post.text}</Text>
      </Box>
      {meData?.me?.id !== data.post.creator.id ? null : (
        <EditDeletePostButtons id={data.post.id} />
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Post);
