import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import { PostsQuery, useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next//link";
import { useState } from "react";
import UpdootSection from "../components/UpdootSection";
import EditDeletePostButtons from "../components/EditDeletePostButtons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data: meData }] = useMeQuery();
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  const loadMorePosts = (data: PostsQuery) => {
    const { posts } = data.posts;
    setVariables({
      limit: variables.limit,
      cursor: posts[posts.length - 1].createdAt,
    });
  };

  if (!fetching && !data) {
    return <div>you got query failed for some reason</div>;
  }
  return (
    <Layout>
      <Flex align="center">
        <Heading>News feed</Heading>
      </Flex>
      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8} mb={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading>{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>posted by: {p.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    {meData?.me?.id !== p.creator.id ? null : (
                      <Box ml="auto">
                        <EditDeletePostButtons id={p.id} />
                      </Box>
                    )}
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button onClick={() => loadMorePosts(data)} m="auto" mb={8}>
            Load more posts
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
