getAllUsers{
    users {
      id
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
  }