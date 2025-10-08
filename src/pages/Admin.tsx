import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Heart, Trash2, Edit, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PaginationControls } from "@/components/PaginationControls";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("videos");
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<'all' | 'title' | 'description' | 'category' | 'tags' | 'link'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'unlisted'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    embed_code: "",
    category: "",
    tags: "",
    thumbnail_url: "",
    is_public: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
      fetchCategories();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    setIsAuthenticated(!!data.session);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "thiyo" && password === "thiyo123") {
      // Sign up the admin user if they don't exist
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: "thiyo@admin.local",
        password: "thiyo123thiyo123",
      });

      if (signUpError && !signUpError.message.includes("already registered")) {
        toast({
          title: "Error",
          description: "Authentication failed",
          variant: "destructive",
        });
        return;
      }

      // Sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: "thiyo@admin.local",
        password: "thiyo123thiyo123",
      });

      if (signInError) {
        toast({
          title: "Error",
          description: "Login failed",
          variant: "destructive",
        });
        return;
      }

      setIsAuthenticated(true);
      toast({
        title: "Welcome!",
        description: "Logged in successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate("/");
  };

  // Helper function to extract slug from URL
  const extractSlugFromUrl = (input: string): string => {
    if (input.includes('/video/')) {
      const parts = input.split('/video/');
      return parts[1]?.split('?')[0].split('#')[0] || input;
    }
    return input.trim();
  };

  // Filter and search videos
  const filteredVideos = useMemo(() => {
    let result = [...videos];
    
    // Apply search query
    if (searchQuery.trim()) {
      result = result.filter(video => {
        const query = searchQuery.toLowerCase();
        
        switch (searchField) {
          case 'title':
            return video.title.toLowerCase().includes(query);
          case 'description':
            return video.description?.toLowerCase().includes(query);
          case 'category':
            return video.category.toLowerCase().includes(query);
          case 'tags':
            return video.tags?.some((tag: string) => tag.toLowerCase().includes(query));
          case 'link':
            const slug = extractSlugFromUrl(query);
            return video.slug.toLowerCase() === slug.toLowerCase();
          case 'all':
          default:
            return (
              video.title.toLowerCase().includes(query) ||
              video.description?.toLowerCase().includes(query) ||
              video.category.toLowerCase().includes(query) ||
              video.tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
              video.slug.toLowerCase().includes(query)
            );
        }
      });
    }
    
    // Apply visibility filter
    if (visibilityFilter !== 'all') {
      result = result.filter(video => 
        visibilityFilter === 'public' ? video.is_public : !video.is_public
      );
    }
    
    return result;
  }, [videos, searchQuery, searchField, visibilityFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, searchField, visibilityFilter]);

  const fetchVideos = async () => {
    const { data } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });
    setVideos(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      const { error } = await supabase
        .from("categories")
        .update(categoryFormData)
        .eq("id", editingCategory.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update category",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Success", description: "Category updated successfully" });
    } else {
      const { error } = await supabase
        .from("categories")
        .insert(categoryFormData);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create category",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Success", description: "Category created successfully" });
    }

    setCategoryFormData({ name: "", slug: "", description: "" });
    setEditingCategory(null);
    setCategoryFormOpen(false);
    fetchCategories();
  };

  const handleCategoryEdit = (category: any) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setCategoryFormOpen(true);
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Success", description: "Category deleted successfully" });
    fetchCategories();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const videoData = {
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()),
    };

    if (editingVideo) {
      const { error } = await supabase
        .from("videos")
        .update(videoData)
        .eq("id", editingVideo.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update video",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Success", description: "Video updated successfully" });
    } else {
      const { error } = await supabase
        .from("videos")
        .insert(videoData);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create video",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Success", description: "Video created successfully" });
    }

      setFormData({
        title: "",
        slug: "",
        description: "",
        embed_code: "",
        category: "",
        tags: "",
        thumbnail_url: "",
        is_public: true,
      });
      setEditingVideo(null);
      fetchVideos();
      setActiveTab("videos");
    };

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      slug: video.slug,
      description: video.description || "",
      embed_code: video.embed_code,
      category: video.category,
      tags: video.tags.join(", "),
      thumbnail_url: video.thumbnail_url || "",
      is_public: video.is_public ?? true,
    });
    setActiveTab("add");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    const { error } = await supabase
      .from("videos")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Success", description: "Video deleted successfully" });
    fetchVideos();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gradient">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="thiyo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient">Admin Panel</h1>
          <Button variant="outline" onClick={handleLogout} className="min-h-[44px]">Logout</Button>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="videos" className="flex-1 sm:flex-initial text-xs sm:text-sm min-h-[44px]">Videos</TabsTrigger>
            <TabsTrigger value="add" className="flex-1 sm:flex-initial text-xs sm:text-sm min-h-[44px]">Add/Edit</TabsTrigger>
            <TabsTrigger value="categories" className="flex-1 sm:flex-initial text-xs sm:text-sm min-h-[44px]">Categories</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 sm:flex-initial text-xs sm:text-sm min-h-[44px]">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="videos">
            <Card className="p-3 sm:p-4 lg:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Manage Videos</h2>
              
              {/* Search Section */}
              <div className="space-y-3 mb-6">
                {/* Search Input and Field Selector */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 min-h-[44px]"
                  />
                  <Select value={searchField} onValueChange={(value: any) => setSearchField(value)}>
                    <SelectTrigger className="w-full sm:w-[200px] min-h-[44px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fields</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="description">Description</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="tags">Tags</SelectItem>
                      <SelectItem value="link">🔗 Link/Slug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Helper text for link search */}
                {searchField === 'link' && (
                  <p className="text-sm text-muted-foreground">
                    💡 Paste the full video URL or just the slug to find by link
                  </p>
                )}
                
                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={visibilityFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVisibilityFilter('all')}
                    className="min-h-[44px]"
                  >
                    All
                  </Button>
                  <Button
                    variant={visibilityFilter === 'public' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVisibilityFilter('public')}
                    className="min-h-[44px]"
                  >
                    Public
                  </Button>
                  <Button
                    variant={visibilityFilter === 'unlisted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVisibilityFilter('unlisted')}
                    className="min-h-[44px]"
                  >
                    Unlisted
                  </Button>
                </div>
                
                {/* Results count */}
                <p className="text-sm text-muted-foreground">
                  Showing {filteredVideos.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredVideos.length)} of {filteredVideos.length} videos
                </p>
              </div>
              
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {paginatedVideos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchQuery ? `No videos found matching "${searchQuery}"` : "No videos found"}
                    </p>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="mt-4 min-h-[44px]"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                ) : (
                  paginatedVideos.map((video) => (
                    <Card key={video.id} className="p-4">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base">{video.title}</h3>
                        
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {video.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {video.likes}
                          </span>
                          <Badge variant={video.is_public ? "default" : "secondary"}>
                            {video.is_public ? "Public" : "Unlisted"}
                          </Badge>
                        </div>
                        
                        <div className="text-sm">
                          <span className="text-muted-foreground">Category: </span>
                          <span className="font-medium">{video.category}</span>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(video)}
                            className="flex-1 min-h-[44px]"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(video.id)}
                            className="flex-1 min-h-[44px]"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Title</TableHead>
                          <TableHead className="min-w-[100px]">Category</TableHead>
                          <TableHead className="min-w-[100px]">Visibility</TableHead>
                          <TableHead className="min-w-[80px]">Views</TableHead>
                          <TableHead className="min-w-[80px]">Likes</TableHead>
                          <TableHead className="min-w-[120px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                <TableBody>
                  {paginatedVideos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">
                          {searchQuery ? `No videos found matching "${searchQuery}"` : "No videos found"}
                        </p>
                        {searchQuery && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchQuery("")}
                            className="mt-4 min-h-[44px]"
                          >
                            Clear search
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedVideos.map((video) => (
                          <TableRow key={video.id}>
                            <TableCell className="font-medium">{video.title}</TableCell>
                            <TableCell>{video.category}</TableCell>
                            <TableCell>
                              <Badge variant={video.is_public ? "default" : "secondary"}>
                                {video.is_public ? "Public" : "Unlisted"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {video.views}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {video.likes}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(video)}
                                  className="min-h-[44px]"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(video.id)}
                                  className="min-h-[44px]"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
                  </div>
                </div>
              </div>
            
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card className="p-3 sm:p-4 lg:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                {editingVideo ? "Edit Video" : "Add New Video"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug (URL-friendly)</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                  <Input
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Embed Code</label>
                  <Textarea
                    value={formData.embed_code}
                    onChange={(e) => setFormData({ ...formData, embed_code: e.target.value })}
                    placeholder="<iframe src='...'></iframe>"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                  />
                  <label htmlFor="is_public" className="text-sm font-medium">
                    Public (visible to all)
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="min-h-[44px]">{editingVideo ? "Update Video" : "Add Video"}</Button>
                  {editingVideo && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingVideo(null);
                        setFormData({
                          title: "",
                          slug: "",
                          description: "",
                          embed_code: "",
                          category: "",
                          tags: "",
                          thumbnail_url: "",
                          is_public: true,
                        });
                      }}
                      className="min-h-[44px]"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold">Manage Categories</h2>
                <Dialog open={categoryFormOpen} onOpenChange={setCategoryFormOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingCategory(null);
                      setCategoryFormData({ name: "", slug: "", description: "" });
                    }} className="min-h-[44px]">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <Input
                          value={categoryFormData.name}
                          onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Slug</label>
                        <Input
                          value={categoryFormData.slug}
                          onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          value={categoryFormData.description}
                          onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                        />
                      </div>
                      <Button type="submit" className="min-h-[44px]">{editingCategory ? "Update" : "Create"}</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {categories.map((category) => (
                  <Card key={category.id} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-base">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Slug: {category.slug}
                        </p>
                      </div>
                      
                      {category.description && (
                        <p className="text-sm">{category.description}</p>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCategoryEdit(category)}
                          className="flex-1 min-h-[44px]"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCategoryDelete(category.id)}
                          className="flex-1 min-h-[44px]"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>{category.description || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCategoryEdit(category)}
                              className="min-h-[44px]"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCategoryDelete(category.id)}
                              className="min-h-[44px]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-3 sm:p-4 lg:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Analytics Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="p-4 sm:p-6 bg-secondary rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Videos</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{videos.length}</p>
                </div>
                <div className="p-4 sm:p-6 bg-secondary rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Views</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {videos.reduce((acc, v) => acc + v.views, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 sm:p-6 bg-secondary rounded-lg sm:col-span-2 lg:col-span-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Likes</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {videos.reduce((acc, v) => acc + v.likes, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
