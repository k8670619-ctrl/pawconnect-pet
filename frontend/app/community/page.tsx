'use client';

import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Calendar, MapPin, Users, PlusCircle } from 'lucide-react';

export default function CommunityPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Priya Nair",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      time: "2 hours ago",
      text: "Bruno completed his agility obstacle course training today! Thanks to PawConnect AI breed advisor for the high-protein diet recommendations.",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800",
      likes: 42,
      comments: 7
    },
    {
      id: 2,
      author: "Rohan Kapoor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      time: "5 hours ago",
      text: "Hosting a Weekend Golden Retriever Playdate at Cubbon Park, Bengaluru this Sunday morning at 8 AM! All vaccinated dogs welcome.",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800",
      likes: 89,
      comments: 18
    }
  ]);

  const meetups = [
    { title: "Bengaluru Golden Retriever Meetup", date: "Sun, Aug 3 • 8:00 AM", location: "Cubbon Park, Dog Park Area", attendees: 34 },
    { title: "Mumbai Cat Lovers & Adoption Drive", date: "Sat, Aug 9 • 4:00 PM", location: "Bandra Fort Amphitheatre", attendees: 52 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Pet Community & Meetups</h1>
          <p className="text-xs text-gray-400 mt-1">Connect with local pet owners, join breed meetups, and share stories</p>
        </div>

        <button className="px-5 py-2.5 rounded-xl gradient-button text-xs font-bold text-white shadow-lg flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Share Story
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Community Posts Feed */}
        <div className="lg:col-span-8 space-y-6">
          {posts.map((p) => (
            <div key={p.id} className="glass-panel p-6 rounded-3xl space-y-4 border border-white/10">
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.author} className="w-10 h-10 rounded-full object-cover border border-emerald-500/30" />
                <div>
                  <h4 className="font-bold text-white text-sm">{p.author}</h4>
                  <span className="text-[10px] text-gray-400 block">{p.time}</span>
                </div>
              </div>

              <p className="text-xs text-gray-200 leading-relaxed">{p.text}</p>

              {p.image && (
                <div className="rounded-2xl overflow-hidden h-72 w-full">
                  <img src={p.image} alt="post photo" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center gap-6 pt-2 border-t border-white/10 text-xs text-gray-400">
                <button className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500/20" /> {p.likes} Likes
                </button>
                <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4 text-emerald-400" /> {p.comments} Comments
                </button>
                <button className="flex items-center gap-1.5 hover:text-white transition-colors ml-auto">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Upcoming Pet Meetups */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-white/10">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" /> Upcoming Pet Meetups
            </h3>

            <div className="space-y-4">
              {meetups.map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <h4 className="font-bold text-white">{m.title}</h4>
                  <p className="text-emerald-400 text-[11px] font-semibold">{m.date}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-red-400" /> {m.location}
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-400" /> {m.attendees} Attending
                    </span>
                    <button className="px-3 py-1 rounded-lg gradient-button text-[11px] font-bold text-white">
                      RSVP Free
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
