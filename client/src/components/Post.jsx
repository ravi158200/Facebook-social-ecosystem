import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';

const Post = ({ post }) => {
  const { user, token } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes);
  const isLiked = Boolean(likes[user._id]);
  const likeCount = Object.keys(likes).length;
  const navigate = useNavigate();
  const commentInputRef = useRef(null);

  const [showComments, setShowComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = async () => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/posts/${post._id}/like`, { userId: user._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikes(res.data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.patch(`http://localhost:5000/api/posts/${post._id}/comment`, {
        userId: user._id,
        comment: commentText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data.comments);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    alert("Post shared successfully to your profile!");
  };

  const toggleComments = () => {
    if (!showComments) {
      setShowComments(true);
      setTimeout(() => commentInputRef.current?.focus(), 100);
    } else {
      setShowComments(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mt-4 w-full h-fit border border-gray-100 overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/profile/${post.userId}`)}>
          <Avatar
            picturePath={post.userPicturePath}
            firstName={post.firstName}
            lastName={post.lastName}
            size={40}
          />
          <div>
            <span className="font-semibold text-[15px]">{post.firstName} {post.lastName}</span>
            <p className="text-[12px] text-gray-400 font-medium">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-400 transition-colors">
          <MoreHorizontal />
        </div>
      </div>

      {post.description && <div className="px-4 pb-3 text-[15px] leading-relaxed text-gray-800">{post.description}</div>}
      {post.picturePath && <img src={`http://localhost:5000/assets/${post.picturePath}`} alt="" className="w-full object-cover max-h-[600px] border-t border-b border-gray-50" />}
      {post.videoPath && (
        <video src={`http://localhost:5000/assets/${post.videoPath}`} controls className="w-full rounded-b-none border-t border-gray-100 max-h-[600px] bg-black" />
      )}
      
      <div className="px-4 py-2.5 flex items-center justify-between text-gray-500 border-b border-gray-50 bg-gray-50/30">
        <div className="flex items-center gap-1.5">
          <div className="bg-facebookBlue rounded-full p-1 w-5 h-5 flex items-center justify-center text-white shadow-sm shadow-blue-200">
            <ThumbsUp size={12} fill="currentColor" />
          </div>
          <span className="text-sm font-bold">{likeCount}</span>
        </div>
        <div className="flex gap-4 text-[13px] font-bold text-gray-400">
          <span className="hover:underline cursor-pointer" onClick={toggleComments}>{comments.length} comments</span>
          <span>0 shares</span>
        </div>
      </div>

      <div className="px-2 py-1 flex items-center justify-between">
        <button onClick={handleLike} className={`hover:bg-gray-50 rounded-lg p-2 flex-1 flex items-center justify-center gap-2 font-bold text-sm transition-all ${isLiked ? 'text-facebookBlue' : 'text-gray-500'}`}>
          <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} /> Like
        </button>
        <button onClick={toggleComments} className="hover:bg-gray-50 rounded-lg p-2 flex-1 flex items-center justify-center gap-2 font-bold text-sm text-gray-500 transition-all">
          <MessageSquare size={18} /> Comment
        </button>
        <button onClick={handleShare} className="hover:bg-gray-100 rounded-lg p-2 flex-1 flex items-center justify-center gap-2 font-bold text-sm text-gray-500 transition-all">
          <Share2 size={18} /> Share
        </button>
      </div>

      {showComments && (
        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-300">
            <hr className="mb-4 border-gray-50" />
            
            <div className="space-y-4 mb-4">
               {comments.map((c, i) => (
                  <div key={i} className="flex gap-2">
                     <Avatar
                       picturePath={c.userPicturePath}
                       firstName={c.firstName}
                       lastName={c.lastName}
                       size={32}
                       style={{ marginTop: '4px', flexShrink: 0 }}
                     />
                     <div className="bg-gray-100 p-3 rounded-2xl">
                        <p className="font-bold text-[13px] text-gray-900">{c.firstName} {c.lastName}</p>
                        <p className="text-[14px] text-gray-700 leading-snug">{c.text}</p>
                     </div>
                  </div>
               ))}
            </div>

            <form onSubmit={handleComment} className="flex items-center gap-3">
               <Avatar picturePath={user.profilePicture} firstName={user.firstName} lastName={user.lastName} size={36} />
               <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-center focus-within:ring-2 ring-blue-100 transition-all">
                  <input 
                    ref={commentInputRef}
                    type="text" 
                    placeholder="Write a comment..." 
                    className="bg-transparent outline-none w-full text-[14px] font-medium"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button type="submit" className="text-facebookBlue font-black text-sm px-2 hover:bg-blue-50 rounded-lg py-1 transition-colors">Post</button>
               </div>
            </form>
        </div>
      )}
    </div>
  );
};
export default Post;
