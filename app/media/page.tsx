'use client';

import React, { useState } from 'react';
import { 
  Grid, 
  List, 
  Image,
  FileText,
  Search, 
  Filter, 
  Plus, 
  Folder, 
  Video, 
  MoreVertical,
  Clock,
  Users,
  Eye,
  Tag as TagIcon,
  Play,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MediaItem {
  id: string;
  type: 'folder' | 'video' | 'image' | 'pdf' | 'gif';
  title: string;
  thumbnail?: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
  size?: string;
  duration?: string;
  collaborators?: Array<{
    name: string;
    avatar: string;
  }>;
  tags?: string[];
}

const FILE_TYPE_ICONS = {
  video: Video,
  image: Image,
  pdf: FileText,
  gif: Image
} as const;

const MOCK_DATA: MediaItem[] = [
  // Folders
  {
    id: 'folder-1',
    type: 'folder',
    title: 'Marketing Videos',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-20',
  },
  {
    id: 'folder-2',
    type: 'folder',
    title: 'Product Demos',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-18',
  },
  {
    id: 'folder-3',
    type: 'folder',
    title: 'Event Recordings',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-15',
  },
  {
    id: 'folder-4',
    type: 'folder',
    title: 'Training Materials',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-12',
  },
  // Generate video items
  ...(Array.from({ length: 8 }, (_, i) => ({
    id: `video-${i + 1}`,
    type: 'video',
    title: `Project Video ${i + 1}`,
    thumbnail: `https://picsum.photos/seed/video${i + 1}/360/640`,
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    size: '256 MB',
    duration: '5:30',
    views: Math.floor(Math.random() * 10000) + 100,
    collaborators: [
      {
        name: 'Alice Smith',
        avatar: 'https://picsum.photos/seed/user1/32/32'
      },
      {
        name: 'Bob Johnson',
        avatar: 'https://picsum.photos/seed/user2/32/32'
      }
    ],
    tags: [
      'at Miami',
      'MAC Tournament',
      'vs. Auburn',
      'at Kentucky',
      'vs. Tennessee',
      'NCAA Tournament'
    ].slice(0, Math.floor(Math.random() * 2) + 1) // Get 1-2 random event tags
  }))),
  // Generate image items
  ...(Array.from({ length: 6 }, (_, i) => ({
    id: `image-${i + 1}`,
    type: 'image',
    title: `Project Image ${i + 1}`,
    thumbnail: `https://picsum.photos/seed/image${i + 1}/400/400`,
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    size: '2.4 MB',
    tags: [
      'at Miami',
      'MAC Tournament', 
      'vs. Auburn',
      'at Kentucky',
      'vs. Tennessee',
      'NCAA Tournament'
    ].slice(0, Math.floor(Math.random() * 2) + 1) // Get 1-2 random event tags
  }))),
  // Generate PDF items
  ...(Array.from({ length: 4 }, (_, i) => ({
    id: `pdf-${i + 1}`,
    type: 'pdf',
    title: `Document ${i + 1}.pdf`,
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    size: '1.2 MB'
  })))
];

export default function MediaPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);

  return (
    <div className="flex flex-col h-full ml-[60px]">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">Media Library</h1>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Video
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search media..."
                  className="pl-10 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter media" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Media</SelectItem>
                  <SelectItem value="videos">Videos</SelectItem>
                  <SelectItem value="images">Images</SelectItem>
                  <SelectItem value="pdfs">PDFs</SelectItem>
                  <SelectItem value="gifs">GIFs</SelectItem>
                  <SelectItem value="folders">Folders</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center rounded-lg border bg-background">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Folders Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Folders</h2>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-2'}>
                {MOCK_DATA.filter(item => item.type === 'folder').map((folder) => (
                  <Card key={folder.id} className={`${
                    viewMode === 'grid' ? 'p-4' : 'p-3'
                  } hover:bg-accent/5 cursor-pointer transition-colors`}>
                    <div className={viewMode === 'grid' ? 'space-y-4' : 'flex items-center gap-4'}>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Folder className="w-5 h-5 text-primary" />
                      </div>
                      <div className={viewMode === 'grid' ? '' : 'flex-1'}>
                        <h3 className="font-medium">{folder.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Updated {folder.updatedAt}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Move</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Videos Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Videos</h2>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-2'}>
                {MOCK_DATA.filter(item => item.type === 'video').map((video) => (
                  <Card key={video.id} className={`${
                    viewMode === 'grid' ? '' : 'p-3'
                  } overflow-hidden hover:bg-accent/5 cursor-pointer transition-colors`}>
                    {viewMode === 'grid' && video.type === 'video' ? (
                      <>
                        <div className="aspect-[9/16] relative group">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          {video.views !== undefined && (
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {video.views >= 1000 
                                ? `${(video.views / 1000).toFixed(1)}k` 
                                : video.views}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="bg-white/90"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVideo(video);
                              }}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{video.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Share</DropdownMenuItem>
                                <DropdownMenuItem>Download</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Clock className="w-4 h-4" />
                            <span>{video.duration}</span>
                            {video.duration && <span>•</span>}
                            <span>{video.size}</span>
                          </div>
                          {video.tags?.length > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              {video.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {video.collaborators?.map((collaborator) => (
                                <Avatar key={collaborator.name} className="w-6 h-6 border-2 border-background">
                                  <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                                  <AvatarFallback>
                                    {collaborator.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {video.updatedAt}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-24 aspect-[9/16] relative rounded-lg overflow-hidden">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="absolute inset-0 m-auto bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVideo(video);
                            }}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-2">{video.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{video.duration}</span>
                              {video.views !== undefined && (
                                <>
                                  <span>•</span>
                                  <Eye className="w-4 h-4" />
                                  <span>
                                    {video.views >= 1000 
                                      ? `${(video.views / 1000).toFixed(1)}k` 
                                      : video.views}
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <TagIcon className="w-4 h-4" />
                              <span>{video.tags?.length ? video.tags.join(', ') : ''}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {video.collaborators?.map((collaborator) => (
                                <Avatar key={collaborator.name} className="w-6 h-6 border-2 border-background">
                                  <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                                  <AvatarFallback>
                                    {collaborator.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {video.updatedAt}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-4 flex-row items-center justify-between">
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>
          <div className="relative bg-black aspect-video">
            <video
              src={selectedVideo?.thumbnail} // In a real app, this would be the video URL
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>
          {selectedVideo && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedVideo.duration}</span>
                  </div>
                  {selectedVideo.views !== undefined && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {selectedVideo.views >= 1000 
                          ? `${(selectedVideo.views / 1000).toFixed(1)}k views` 
                          : `${selectedVideo.views} views`}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex -space-x-2">
                  {selectedVideo.collaborators?.map((collaborator) => (
                    <Avatar key={collaborator.name} className="w-6 h-6 border-2 border-background">
                      <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                      <AvatarFallback>
                        {collaborator.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
              {selectedVideo.tags?.length > 0 && (
                <div className="flex items-center gap-2">
                  {selectedVideo.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}