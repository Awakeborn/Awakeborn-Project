import { getBlogPosts } from "@/components/mdx/utils";
import CategoryProvider from "../../../../components/category-provider";
import PageIllustration from "@/components/page-illustration";
import BlogFilters from "./filters";
import PostItem from "@/components/post-item";

export const metadata = {
  title: "Blog - Open PRO",
  description: "Page description",
};

import Cta from "@/components/cta";
import Pagination from "./pagination";

export default function Blog() {
  const allBlogs = getBlogPosts();

  // Sort posts by date
  allBlogs.sort((a, b) => {
    return new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
      ? -1
      : 1;
  });

  return (
    <>
      <PageIllustration multiple />
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Hero content */}
          <div className="py-12 md:py-20">
            {/* Section header */}
            <div className="pb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-purple-400 via-pink-400 animate-fade-in-slow to-blue-400 bg-clip-text text-transparent drop-shadow-xl tracking-tight h-[70px]">
                The Awakeborn Blog
              </h1>
              <div className="mx-auto max-w-3xl">
                <p className="text-xl text-indigo-200/80 animate-fade-in-slow">
                  Discover the latest news, tips and user research insights from Open PRO.
                </p>
              </div>
            </div>
            <div className="animate-fade-in-slow rounded-3xl bg-gray-950/80 shadow-2xl border border-purple-900/40 backdrop-blur-xl p-6 md:p-10 transition-all duration-500 mb-12">
              <CategoryProvider>
                {/* Buttons */}
                <BlogFilters />
                {/* Articles */}
                <div className="mx-auto grid max-w-sm items-start gap-8 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 mt-8">
                  {allBlogs.map((post, postIndex) => (
                    <PostItem key={postIndex} {...post} />
                  ))}
                </div>
              </CategoryProvider>
              {/* Pagination */}
              <div className="flex justify-center mt-10">
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
