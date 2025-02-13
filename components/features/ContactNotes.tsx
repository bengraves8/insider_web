'use client';

import { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Pencil,
  X,
  Check,
  Clock,
  MoreHorizontal,
  Trash2,
  ListOrdered,
  FileText,
  Film
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface Note {
  id: string;
  content: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  formatting?: {
    bold?: boolean[];
    italic?: boolean[];
    links?: Array<{ start: number; end: number; url: string; }>;
  };
  attachments?: Array<{
    id: string;
    type: 'image' | 'video' | 'document';
    name: string;
    size: number;
    url: string;
  }>;
}

const initialNotes: Note[] = [
  {
    id: 'note-1',
    content: 'Client expressed interest in our new enterprise package. Follow up next week with detailed pricing.\n\n**Key Points:**\n- Interested in premium features\n- Budget range: $10k-15k\n- Timeline: Q2 2024\n\n![Meeting Notes](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800)',
    timestamp: '2024-03-20T14:30:00Z',
    user: {
      name: 'Alice Smith',
      avatar: 'https://picsum.photos/seed/user1/32/32'
    },
    attachments: [
      {
        id: 'att-1',
        type: 'image',
        name: 'meeting-notes.jpg',
        size: 245000,
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800'
      }
    ]
  },
  {
    id: 'note-2',
    content: 'Discussed potential partnership opportunities for the upcoming charity event. Very positive response.\n\n1. Main discussion points\n2. Action items\n3. Next steps\n\n_Important: Follow up by end of week_',
    timestamp: '2024-03-15T10:00:00Z',
    user: {
      name: 'Bob Johnson',
      avatar: 'https://picsum.photos/seed/user2/32/32'
    }
  }
];

interface ContactNotesProps {
  contactId: string;
}

interface NoteEditorProps {
  initialContent?: string;
  onSave: (content: string, attachments?: File[]) => void;
  onCancel: () => void;
}

function NoteEditor({ initialContent = '', onSave, onCancel }: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [selectedFormat, setSelectedFormat] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyFormat = (format: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newContent = content;
    let newCursorPos = end;

    switch (format) {
      case 'bold':
        newContent = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newContent = content.substring(0, start) + `_${selectedText}_` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'bullet-list':
        newContent = content.substring(0, start) + `\n- ${selectedText}` + content.substring(end);
        newCursorPos = end + 3;
        break;
      case 'numbered-list':
        newContent = content.substring(0, start) + `\n1. ${selectedText}` + content.substring(end);
        newCursorPos = end + 4;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          newContent = content.substring(0, start) + `[${selectedText}](${url})` + content.substring(end);
          newCursorPos = end + url.length + 4;
        }
        break;
    }

    setContent(newContent);
    textarea.focus();
    setTimeout(() => {
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);

    // Add file references to content
    const fileRefs = files.map(file => {
      if (file.type.startsWith('image/')) {
        return `\n![${file.name}](${URL.createObjectURL(file)})`;
      }
      return `\n[${file.name}](attachment)`;
    }).join('\n');

    setContent(content + fileRefs);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Film className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => applyFormat('bold')}
            className={selectedFormat.includes('bold') ? 'bg-accent' : ''}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => applyFormat('italic')}
            className={selectedFormat.includes('italic') ? 'bg-accent' : ''}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => applyFormat('bullet-list')}
            className={selectedFormat.includes('bullet-list') ? 'bg-accent' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => applyFormat('numbered-list')}
            className={selectedFormat.includes('numbered-list') ? 'bg-accent' : ''}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => applyFormat('link')}
            className={selectedFormat.includes('link') ? 'bg-accent' : ''}
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleFileSelect}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
            multiple
          />
        </div>

        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          className="min-h-[200px] border-0 rounded-none focus-visible:ring-0"
        />

        {attachments.length > 0 && (
          <div className="border-t p-4 space-y-2">
            <h4 className="text-sm font-medium">Attachments</h4>
            <div className="grid grid-cols-2 gap-2">
              {attachments.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getFileIcon(file)}
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={() => onSave(content, attachments)}>
          <Check className="w-4 h-4 mr-2" />
          Save Note
        </Button>
      </div>
    </div>
  );
}

export function ContactNotes({ contactId }: ContactNotesProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleSaveNote = (noteId: string, content: string, attachments?: File[]) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? {
            ...note,
            content,
            timestamp: new Date().toISOString(),
            attachments: attachments?.map((file, index) => ({
              id: `attachment-${index}`,
              type: file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : 'document',
              name: file.name,
              size: file.size,
              url: URL.createObjectURL(file)
            }))
          }
        : note
    ));
    setEditingNoteId(null);
  };

  const handleAddNote = (content: string, attachments?: File[]) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      user: {
        name: 'Current User',
        avatar: 'https://picsum.photos/seed/current-user/32/32'
      },
      attachments: attachments?.map((file, index) => ({
        id: `attachment-${index}`,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      }))
    };
    setNotes([newNote, ...notes]);
    setIsAddingNote(false);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const renderNoteContent = (content: string) => {
    const lines = content.split('\n');
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;

    return lines.map((line, index) => {
      // Handle list items
      if (line.startsWith('- ') || /^\d+\.\s/.test(line)) {
        const isOrderedList = /^\d+\.\s/.test(line);
        const newListType = isOrderedList ? 'ol' : 'ul';
        
        // If we're starting a new list or changing list type
        if (!inList || listType !== newListType) {
          inList = true;
          listType = newListType;
          const listClass = listType === 'ul' ? 'list-disc' : 'list-decimal';
          return `<${listType} class="ml-6 ${listClass} my-2">
                    <li>${line.replace(/^-\s|^\d+\.\s/, '')}</li>`;
        }
        
        return `<li>${line.replace(/^-\s|^\d+\.\s/, '')}</li>`;
      }

      // Close list if we were in one
      if (inList) {
        inList = false;
        listType = null;
        return `</${listType}>${line ? `<p class="my-2">${line}</p>` : ''}`;
      }

      // Handle images
      if (line.match(/!\[.*?\]\(.*?\)/)) {
        return line.replace(
          /!\[(.*?)\]\((.*?)\)/g,
          '<div class="my-4"><img src="$2" alt="$1" class="rounded-lg border shadow-sm max-w-full h-auto" /></div>'
        );
      }

      // Handle inline formatting
      line = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/_(.*?)_/g, '<em class="italic">$1</em>')
        .replace(
          /\[(.*?)\]\((.*?)\)/g,
          '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
        );

      return line ? `<p class="my-2">${line}</p>` : '<br />';
    }).join('\n');
  };

  return (
    <div className="space-y-6">
      {isAddingNote ? (
        <NoteEditor
          onSave={handleAddNote}
          onCancel={() => setIsAddingNote(false)}
        />
      ) : (
        <Button onClick={() => setIsAddingNote(true)}>
          Add Note
        </Button>
      )}

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="flex gap-4 p-4 border rounded-lg">
            <Avatar>
              <AvatarImage src={note.user.avatar} alt={note.user.name} />
              <AvatarFallback>
                {note.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{note.user.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingNoteId(note.id)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Note
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Note
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {editingNoteId === note.id ? (
                <NoteEditor
                  initialContent={note.content}
                  onSave={(content, attachments) => handleSaveNote(note.id, content, attachments)}
                  onCancel={() => setEditingNoteId(null)}
                />
              ) : (
                <>
                  <div 
                    className="mt-2 prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: renderNoteContent(note.content) }}
                  />
                  {note.attachments && note.attachments.length > 0 && (
                    <div className="mt-4 space-y-4">
                      <h4 className="text-sm font-medium">Attachments</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {note.attachments.map((attachment) => (
                          <div 
                            key={attachment.id}
                            className="border rounded-lg overflow-hidden"
                          >
                            {attachment.type === 'image' ? (
                              <div className="aspect-video relative">
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="p-4 flex items-center gap-3">
                                {attachment.type === 'video' ? (
                                  <Film className="w-6 h-6 text-muted-foreground" />
                                ) : (
                                  <FileText className="w-6 h-6 text-muted-foreground" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {(attachment.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="p-2 bg-muted/50 border-t">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                asChild
                              >
                                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                  View {attachment.type === 'image' ? 'Full Image' : 'File'}
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}