const myUser = `firstName: "Ted", lastName: "Dred"`;
let graph_query = `mutation addUser { addUser( ${myUser} ) { firstName lastName } }`;

let gql_string = JSON.stringify(graph_query);
console.log(gql_string);
