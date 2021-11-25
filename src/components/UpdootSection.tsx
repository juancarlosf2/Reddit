import React, { ReactElement, useState } from "react";
import { Flex, IconButton } from "@chakra-ui/core";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";
interface Props {
  post: PostSnippetFragment;
}

function UpdootSection({ post }: Props): ReactElement {
  const [vote] = useVoteMutation();
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");

  const updateAfterVote = (
    value: number,
    postId: number,
    cache: ApolloCache<VoteMutation>
  ) => {
    const data = cache.readFragment<{
      id: number;
      points: number;
      voteStatus: number | null;
    }>({
      id: "Post:" + postId,
      fragment: gql`
        fragment _ on Post {
          id
          points
          voteStatus
        }
      `,
    });
    if (data) {
      if (data.voteStatus === value) {
        return;
      }
      const newPoints =
        (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
      cache.writeFragment({
        id: "Post:" + postId,
        fragment: gql`
          fragment _ on Post {
            points
            voteStatus
          }
        `,
        data: { points: newPoints, voteStatus: value },
      });
    }
  };
  const handleVote = async (upOrDown: "up" | "down") => {
    const value = upOrDown === "up" ? 1 : -1;
    if (value === 1) {
      setLoadingState("updoot-loading");
    } else if (value === -1) {
      setLoadingState("downdoot-loading");
    }
    await vote({
      variables: {
        postId: post.id,
        value: value,
      },
      update: (cache) => {
        updateAfterVote(value, post.id, cache);
      },
    });
    setLoadingState("not-loading");
  };

  return (
    <Flex direction="column" alignItems="center" mr={4} justifyContent="center">
      <IconButton
        onClick={() => {
          if (post.voteStatus === 1) {
            return;
          } else {
            handleVote("up");
          }
        }}
        isLoading={loadingState === "updoot-loading"}
        icon="chevron-up"
        variantColor={post.voteStatus === 1 ? "green" : undefined}
        aria-label="updoot post"
      />
      {post.points}
      <IconButton
        onClick={() => {
          if (post.voteStatus === -1) {
            return;
          } else {
            handleVote("down");
          }
        }}
        isLoading={loadingState === "downdoot-loading"}
        variantColor={post.voteStatus === -1 ? "red" : undefined}
        icon="chevron-down"
        aria-label="downdoot post"
      />
    </Flex>
  );
}

export default UpdootSection;
