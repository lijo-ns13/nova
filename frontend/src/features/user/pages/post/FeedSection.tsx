// import { useState } from "react";
// import PostCard from "./PostCard";
// import FeedFilter from "./FeedFilter";

// const FeedSection = ({ posts }) => {
//   const [filter, setFilter] = useState("all");

//   const filteredPosts =
//     filter === "all"
//       ? posts
//       : filter === "media"
//       ? posts.filter((post) => post.media)
//       : posts.filter((post) => !post.media);

//   return (
//     <div>
//       <FeedFilter activeFilter={filter} onFilterChange={setFilter} />

//       <div className="space-y-4 mt-4">
//         {filteredPosts.length > 0 ? (
//           filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
//             <div className="text-gray-500">No posts to display</div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FeedSection;
