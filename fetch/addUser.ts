const nexusGraphqlResponseAddUser = async (): Promise<Response> => {
  //the graphql query is stringified before adding to other params as value of the body key
  const myUser = `firstName: "Jamie", lastName: "Lanister"`;
  const data = JSON.stringify({
    query: `mutation addUser{
      addUser(${myUser}){
        firstName
        lastName
        writtenPosts {
          id
          title
          body
          published
          authorId
        }
      }
    }`,
  });

  //otherParams includes the request type, header and body data to be passed into the fetch request
  const otherParams = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };

  const response = await fetch("http:localhost:4000", otherParams);

  return response;
};

await nexusGraphqlResponseAddUser()
  .then((res) => res.json())
  .then((result) => {
    console.log(result);
  });
