import React, { useState } from 'react';
import { 
  MessageSquareShare, 
  MapPin, 
  Clock, 
  Plus, 
  ThumbsUp, 
  MessageCircle, 
  AlertTriangle, 
  BookOpen, 
  Car, 
  HelpCircle,
  X,
  Send
} from 'lucide-react';
import { CommunityPost } from '../types';

interface CampusBuzzFeedProps {
  posts: CommunityPost[];
  onAddPost: (post: CommunityPost) => void;
  selectedUniversity: string;
  isVerifiedStudent: boolean;
}

export const CampusBuzzFeed: React.FC<CampusBuzzFeedProps> = ({
  posts,
  onAddPost,
  selectedUniversity,
  isVerifiedStudent,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'lost_found' | 'study_group' | 'rideshare' | 'alert'>('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  
  // New post state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'lost_found' | 'study_group' | 'rideshare' | 'alert'>('lost_found');
  const [authorName, setAuthorName] = useState('');
  const [campusName, setCampusName] = useState('Main Campus');

  const filteredPosts = posts.filter(p => {
    if (activeFilter !== 'all' && p.type !== activeFilter) return false;
    if (selectedUniversity !== 'all' && p.universityId !== selectedUniversity) return false;
    return true;
  });

  const handleLike = (id: string) => {
    setLikesMap(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const newPost: CommunityPost = {
      id: `buzz-${Date.now()}`,
      type: postType,
      title: postTitle.trim(),
      content: postContent.trim(),
      author: authorName.trim() || 'Comrade Student',
      authorRole: isVerifiedStudent ? 'Verified Comrade' : 'Campus Member',
      universityId: selectedUniversity,
      campusName: campusName.trim() || 'Main Campus',
      timeAgo: 'Just now',
      repliesCount: 0,
      likesCount: 1,
      statusTag: postType === 'lost_found' ? 'LOST & FOUND' : postType === 'study_group' ? 'STUDY SQUAD' : postType === 'rideshare' ? 'CARPOOL' : 'CAMPUS ALERT',
    };

    onAddPost(newPost);
    setShowNewPostModal(false);
    setPostTitle('');
    setPostContent('');
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <MessageSquareShare className="w-5 h-5 text-[#F3B71B]" />
            <span>Campus Buzz & Noticeboard</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Real-time student lost & found, study squads, carpools, and campus safety tips
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewPostModal(true)}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#F3B71B]/10 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post to Campus Buzz</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Buzz' },
          { id: 'lost_found', label: '🔍 Lost & Found' },
          { id: 'study_group', label: '📚 Study Groups' },
          { id: 'rideshare', label: '🚗 Carpool / Rideshare' },
          { id: 'alert', label: '⚠️ Safety Alerts' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id as any)}
            className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeFilter === f.id
                ? 'bg-[#F3B71B] text-black font-bold shadow-sm'
                : 'bg-[#1E1E1E] border border-neutral-800 text-neutral-300 hover:bg-[#252525]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center bg-[#1A1A1A] rounded-2xl border border-neutral-800 text-neutral-400 text-xs">
            No community posts found for this campus filter. Be the first comrade to post!
          </div>
        ) : (
          filteredPosts.map((post) => {
            const addedLikes = likesMap[post.id] || 0;
            return (
              <div
                key={post.id}
                className="bg-[#1E1E1E] rounded-2xl border border-neutral-800 p-4 hover:border-[#F3B71B]/50 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.2)] space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F3B71B] bg-[#F3B71B]/15 border border-[#F3B71B]/30 px-2 py-0.5 rounded-md font-mono">
                      {post.statusTag || post.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-neutral-600">·</span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F3B71B]" />
                      {post.campusName}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono">{post.timeAgo}</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{post.title}</h3>

                <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-300">
                    <span>By {post.author}</span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-[11px] text-[#F3B71B] font-mono">{post.authorRole}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 hover:text-[#F3B71B] transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.likesCount + addedLikes}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.repliesCount} replies</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-neutral-800 bg-[#141414] flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Post to Campus Buzz</h3>
              <button
                type="button"
                onClick={() => setShowNewPostModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Post Type</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPostType('lost_found')}
                    className={`p-2 rounded-xl border text-left flex items-center gap-1.5 ${
                      postType === 'lost_found' ? 'bg-[#F3B71B]/20 border-[#F3B71B] font-bold text-[#F3B71B]' : 'bg-[#242424] border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Lost & Found</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostType('study_group')}
                    className={`p-2 rounded-xl border text-left flex items-center gap-1.5 ${
                      postType === 'study_group' ? 'bg-[#F3B71B]/20 border-[#F3B71B] font-bold text-[#F3B71B]' : 'bg-[#242424] border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Study Squad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostType('rideshare')}
                    className={`p-2 rounded-xl border text-left flex items-center gap-1.5 ${
                      postType === 'rideshare' ? 'bg-[#F3B71B]/20 border-[#F3B71B] font-bold text-[#F3B71B]' : 'bg-[#242424] border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Carpool</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostType('alert')}
                    className={`p-2 rounded-xl border text-left flex items-center gap-1.5 ${
                      postType === 'alert' ? 'bg-[#F3B71B]/20 border-[#F3B71B] font-bold text-[#F3B71B]' : 'bg-[#242424] border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Safety Alert</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Lost Student ID card near Chiromo library"
                  className="w-full px-3 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 outline-none focus:border-[#F3B71B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Details & Description</label>
                <textarea
                  rows={3}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Explain what happened, details, contacts, or meetup spot..."
                  className="w-full px-3 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 outline-none focus:border-[#F3B71B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Mercy Chemtai"
                    className="w-full px-3 py-1.5 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 outline-none focus:border-[#F3B71B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Campus</label>
                  <input
                    type="text"
                    value={campusName}
                    onChange={(e) => setCampusName(e.target.value)}
                    placeholder="e.g. Main Campus"
                    className="w-full px-3 py-1.5 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 outline-none focus:border-[#F3B71B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-xs shadow-md shadow-[#F3B71B]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post to Campus Buzz</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
