import { useState, useEffect } from "react";
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

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("videos");

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

  const fetchVideos = async () => {
    const { data } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });
    setVideos(data || []);
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">Admin Panel</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="add">Add/Edit Video</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="videos">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Manage Videos</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video) => (
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
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingVideo ? "Edit Video" : "Add New Video"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug * (URL-friendly)</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="my-video-title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Embed Code * (iframe)</label>
                  <Textarea
                    value={formData.embed_code}
                    onChange={(e) => setFormData({ ...formData, embed_code: e.target.value })}
                    rows={4}
                    placeholder='<iframe src="..." ...></iframe>'
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Entertainment, Music, Sports, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="funny, viral, trending"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                  <Input
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Video Visibility</label>
                    <p className="text-sm text-muted-foreground">
                      {formData.is_public 
                        ? "Video is visible on all public pages" 
                        : "Video is unlisted but accessible via direct link"}
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingVideo ? "Update Video" : "Create Video"}
                  </Button>
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
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Analytics Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Videos</p>
                  <p className="text-3xl font-bold text-primary">{videos.length}</p>
                </div>
                <div className="p-6 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-primary">
                    {videos.reduce((acc, v) => acc + v.views, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-6 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Likes</p>
                  <p className="text-3xl font-bold text-primary">
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
