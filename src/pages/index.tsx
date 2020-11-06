import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import Layout from "../components/Layout";
import { PostsQuery, useMeQuery, usePostsQuery } from "../generated/graphql";
import NextLink from "next//link";
import UpdootSection from "../components/UpdootSection";
import EditDeletePostButtons from "../components/EditDeletePostButtons";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data: meData } = useMeQuery();
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null as null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const loadMorePosts = (data: PostsQuery) => {
    const { posts } = data.posts;
    fetchMore({
      variables: {
        limit: variables?.limit,
        cursor: posts[posts.length - 1].createdAt,
      },
    });
  };

  if (!loading && !data) {
    return <div>you got query failed for some reason</div>;
  }
  return (
    <Layout>
      <Flex align="center">
        <Heading>News feed</Heading>
      </Flex>
      <br />
      {!data && loading ? (
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
          <Button
            onClick={() => loadMorePosts(data)}
            isLoading={loading}
            m="auto"
            mb={8}
          >
            Load more posts
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
