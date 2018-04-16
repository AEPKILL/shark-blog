import highlightJs from 'highlight.js';
import marked from 'marked';
import React from 'react';
import join from 'url-join';

import './post.scss';

const { Renderer } = marked;

const Post: React.SFC<{ content: string }> = props => {
  let htmlString = marked.parse(props.content);
  if (BLOG_INFO.BLOG_INFO.extra && BLOG_INFO.BLOG_INFO.extra.imgServer) {
    htmlString = redirectImgSrc(htmlString);
  }
  const html = {
    __html: htmlString
  };
  return <article className="post-content" dangerouslySetInnerHTML={html} />;
};

function redirectImgSrc(html: string) {
  const div = document.createElement('div');
  const postDir = BLOG_INFO.BLOG_INFO.postDir;
  div.innerHTML = html;
  const imgs = Array.from(div.querySelectorAll('img'));
  for (const img of imgs) {
    const src = img.getAttribute('src') || '';
    // http:// | https:// | //
    if (!/^(https:|http:)?\/\//.test(src)) {
      img.src = join(BLOG_INFO.BLOG_INFO.extra!.imgServer, postDir, src);
    }
  }
  return div.innerHTML;
}

marked.setOptions({
  renderer: new Renderer(),
  highlight(code: string) {
    return highlightJs.highlightAuto(code).value;
  },
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

export default Post;
