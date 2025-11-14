import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { apiService, imgUrl } from "../../services/api/apiService";
import { toast } from "sonner";

const estimateReadTime = (text: string) => {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)); // ~200 wpm
};

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        const data = await apiService.getBlog(id);
        setPost(data);
      } catch (e) {
        console.error("Error fetching blog:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const readTime = useMemo(() => {
    if (!post) return 0;
    if (post.readTime) {
      const m = parseInt(String(post.readTime).replace(/[^0-9]/g, ""), 10);
      return Number.isFinite(m) && m > 0 ? m : estimateReadTime(post.content || post.description || "");
    }
    return estimateReadTime(post?.content || post?.description || "");
  }, [post]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/blog/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title,
          text: (post?.description || post?.content || "").slice(0, 100) + "...",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto max-w-3xl px-4 py-16">
            <Skeleton className="h-10 w-40 mb-6" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-64 w-full mb-8" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <Button onClick={() => navigate("/blog")}> 
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <article className="container mx-auto max-w-3xl px-4 py-10">
          {/* Breadcrumbs and back */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              <Link to="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/blog" className="hover:underline">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground/80 line-clamp-1 align-middle">{post.title}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            {post.date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {readTime} min read
            </div>
            {/* Category badge removed */}
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>

          {/* Hero image */}
          {post.image && (
            <div className="rounded-xl overflow-hidden mb-8 border bg-muted/30">
              <img
                src={imgUrl(post.image)}
                alt={post.title}
                className="w-full h-[420px] object-cover"
              />
            </div>
          )}

          {/* Article body */}
          <div className="prose dark:prose-invert max-w-none leading-relaxed">
            {post.description && (
              <p className="text-lg text-foreground/90 font-medium mb-4">{post.description}</p>
            )}
            <div className="whitespace-pre-wrap mt-4 text-foreground/90 text-base leading-7">
              {post.content}
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-12 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/blog')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> Share Article
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
