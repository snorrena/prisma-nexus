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
  writtenPosts: Post[];
};
type Users = {
  User: User[];
};
const nexusGraphqlResponse = async (): Promise<Response> => {
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
  return response; // For JSON Response
  //   return response.text(); // For HTML or Text Response
};

await nexusGraphqlResponse()
  .then((res) => res.json())
  .then((result) => {
    const userArray: User[] = result.data.users;
    // console.log(userArray);
    userArray.forEach((user: User) => {
      console.log(`id: ${user.id}`);
      console.log(`firstName: ${user.firstName}`);
      console.log(`lastName: ${user.lastName}`);
      if (user.writtenPosts && user.writtenPosts.length != 0) {
        console.log(`writtenPosts:`);
        user.writtenPosts.forEach((post) => {
          console.log(post);
        });
      }
    });
  });
