import React, { ReactElement, useState } from "react";
import { Flex, IconButton } from "@chakra-ui/core";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface Props {
  post: PostSnippetFragment;
}

function UpdootSection({ post }: Props): ReactElement {
  const [, vote] = useVoteMutation();
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const handleVote = async (upOrDown: "up" | "down") => {
    const value = upOrDown === "up" ? 1 : -1;
    if (value === 1) {
      setLoadingState("updoot-loading");
    } else if (value === -1) {
      setLoadingState("downdoot-loading");
    }
    await vote({
      postId: post.id,
      value: value,
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
