/* (() => {
  fetch("http:localhost:4000")
    .then((resp) => resp.json())
    .then((out) => {
      console.log(`Output: ${out}`);
    })
    .catch((err) => console.log(err));
})(); */

async function fetchNexusGraphqlData(url) {
  const response = fetch(url, {
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
              writtenPosts {
                id
                body
                title
                published
              }
            }
          }`,
    }),
  });
  return (await response).json();
}
fetchNexusGraphqlData("http://localhost:4000").then((data) => {
  //destructure the returned data into the array 'users'
  const {
    data: { users },
  } = data;
  // console.log(users);

  const userList = document.getElementById("userId"); //get the list element from the dom
  users.forEach((element) => {
    //loop over the user array
    const { firstName, lastName, id, writtenPosts } = element; // deconstruct the user array object into useable variable data
    userList.innerHTML += `<li>${firstName} ${lastName}, Id: ${id} </li>`; //append the user data into the dom as a string literal
    userList.innerHTML += `<h2>${firstName}'s posts</h2>`;
    if (writtenPosts.length > 0) {
      writtenPosts.forEach((post) => {
        userList.innerHTML += `<p>&nbsp;&nbsp;id: ${post.id}, title: ${post.title}, body: ${post.body}</p>`;
      });
      userList.innerHTML += `&nbsp;&nbsp;`;
    } else {
      userList.innerHTML += `<p>none</p>`;
      console.log("no posts");
    }
  });
});

// Example POST method implementation:
/* async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  
  postData('https://example.com/answer', { answer: 42 })
    .then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
    }); */
