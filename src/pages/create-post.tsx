import React, { ReactElement } from "react";
import { Box, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";
interface Props {}

function CreatePost({}: Props): ReactElement {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { errors } = await createPost({
            variables: { input: values },
            update: (cache) => {
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                name="text"
                textarea
                placeholder="text..."
                label="Body"
              />
            </Box>

            <Box mt={4}>
              <Button
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                create post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withApollo({ ssr: false })(CreatePost);
