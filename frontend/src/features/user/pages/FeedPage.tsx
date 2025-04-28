import CreatePostSection from "../componets/post/CreatePostSection";

function FeedPage() {
  const handlePostSubmit = () => {
    console.log("Post submitted!");
    // Later: refresh feed, send to backend, etc
  };

  return (
    <>
      <h1>feed page</h1>
      <CreatePostSection onPostSubmit={handlePostSubmit} />
    </>
  );
}

export default FeedPage;
