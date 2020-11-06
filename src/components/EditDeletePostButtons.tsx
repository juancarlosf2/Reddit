import React from "react";
import { Box, IconButton, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import { useDeletePostMutation } from "../generated/graphql";

interface Props {
  id: number;
}

const EditDeletePostButtons: React.FC<Props> = ({ id }) => {
  const [deletePost] = useDeletePostMutation();

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton as={Link} icon="edit" mr={4} aria-label="Edit Post" />
      </NextLink>
      <IconButton
        icon="delete"
        variantColor="red"
        aria-label="Delete Post"
        onClick={() =>
          deletePost({
            variables: { id: id },
            update: (cache) => {
              cache.evict({ id: "Post:" + id });
            },
          })
        }
      />
    </Box>
  );
};

export default EditDeletePostButtons;
