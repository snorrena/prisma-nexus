type Post = {
  id: string;
  title: string;
  body: string;
  published: boolean;
};
type User = {
  id: string;
  firstName: string;
  lastName: string;
  posts: Post[];
};
type Users = {
  User: User[];
};
const nexusGraphqlResponse = async (): Promise<Users> => {
  const response = await fetch("http:localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query getAllUsers{
            users {
              id
              firstName
              lastName
              writtenPosts{
                id
                body
                title
                published
              }
            }
          }`,
    }),
  });
  return response.json(); // For JSON Response
  //   return response.text(); // For HTML or Text Response
};

console.log(await nexusGraphqlResponse());
