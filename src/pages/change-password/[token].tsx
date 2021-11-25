import React, { useState } from "react";
import { NextPage } from "next";
import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link";
import { withApollo } from "../../utils/withApollo";
interface Props {
  token: string;
}

const ChangePassword: NextPage<Props> = ({}) => {
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
            update: (cache, { data: mutationData }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: mutationData?.changePassword.user,
                },
              });
            },
          });
          if (data?.changePassword.errors) {
            const errorMap = toErrorMap(data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {tokenError ? (
              <Flex>
                <Box mr={2} style={{ color: "red" }}>
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>click here to get a new one</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Box mt={4}>
              <Button
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                change password
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
