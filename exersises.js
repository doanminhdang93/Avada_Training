const API_URL = "https://jsonplaceholder.typicode.com";

const fetchData = async (resource) => {
  try {
    const res = await fetch(API_URL + resource);
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const getPostById = async (id) => {
    const [post, comments] = await Promise.all([
      fetchData(`/posts/${id}`),
      fetchData(`/comments?postId=${id}`),
    ]);
    return { ...post, comments };
  };

(async () => {
  try {
    const [allUsers, allPosts, allComments] = await Promise.all([
      fetchData("/users"),
      fetchData("/posts"),
      fetchData("/comments"),
    ]);

    // Get 10 users
    console.log("allUsers: ",allUsers);

    // Get all the posts and comments from the API. Map the data with the users array
    const allPostsAndCommentsMapWithUsers = allUsers.map((user) => {
      const { id, name, username, email } = user;
      return {
        id,
        name,
        username,
        email,
        comments: allComments.filter((comment) => comment.email === user.email),
        posts: allPosts.filter((post) => post.userId === user.id),
      };
    });
    console.log(allPostsAndCommentsMapWithUsers);

    // Filter only users with more than 3 comments
    const allUserWithMoreThan3Comments = allPostsAndCommentsMapWithUsers.filter((item) => item.comments.length > 3);
    console.log(allUserWithMoreThan3Comments);

    // Reformat the data with the count of comments and posts
    const userReformated = allPostsAndCommentsMapWithUsers.map((item) =>{
        const {id, name, username, email} = item;
        return {
            id,
            name,
            username,
            email,
            commentsCount: item.comments.length,
            postsCount: item.posts.length
        }
    })
    console.log(userReformated);

    // Who is the user with the most comments/posts?
    const userWithTheMostComments = userReformated.reduce((prev,curr) =>
        prev.commentsCount > curr.commentsCount ? prev : curr
    )
    // console.log(userWithTheMostComments);
    const userWithTheMostPosts = userReformated.reduce((prev,curr) =>
        prev.postsCount > curr.postsCount ? prev : curr
    )
    console.log(userWithTheMostPosts);

    // Sort the list of users by the postsCount value descending?
    const usersSortedByPostsCount = userReformated.sort((a,b) => b.postsCount - a.postsCount);
    console.log(usersSortedByPostsCount);

    // Get the post with ID of 1 via API request, at the same time get comments for post ID of 1 via another API request. 
    const firstPost = await getPostById(1);
    console.log(firstPost);

  } catch (error) {
    console.log(error);
  }
})();
