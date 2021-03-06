import { BlogConfig } from './utils/blog-config';

declare global {
  interface PagesMetaPath {
    name: string;
    path: string;
    count: number;
  }
  // tslint:disable-next-line:no-any
  interface PagesMeta<T = any> {
    currentPage: number;
    count: number;
    pageSize: number;
    pre: boolean;
    next: boolean;
    items: T[];
  }
  type PostPagesMeta = PagesMeta<PostMeta>;
  interface PostMeta {
    title: string;
    date: string;
    description: string;
    source: string;
    categories?: string;
    tags?: string[];
  }
  const BLOG_INFO: {
    BLOG_INFO: BlogConfig;
    POST_INFO: PagesMetaPath;
    TAGS_INFO: PagesMetaPath[];
    CATEGORIES_INFO: PagesMetaPath[];
  };
}
