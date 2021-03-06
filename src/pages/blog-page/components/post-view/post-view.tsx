import DelayShow from '@components/delay-show/delay-show';
import Error from '@components/error/error';
import ImgPreview from '@components/img-preview/img-preview';
import Loading from '@components/loading/loading';
import PostMeta from '@components/post-meta/post-meta';
import Title from '@components/title';
import PostFetchServices from '@services/post-fetch';
import AsyncData, { ASYNC_STATUS } from '@stores/utils/async-data';
import separateMarkdownMeta from '../../../../../bin/separate-markdown-meta';

import * as React from 'react';
import Loadable from 'react-loadable';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'ts-mobx-react';
import join from 'url-join';

import '@components/post/post.scss';

const Post = Loadable({
  loader: () => import(/* webpackChunkName: "post" */ '@components/post/post'),
  loading(props) {
    if (props.error) {
      return <h3>can't load post component.</h3>;
    } else {
      return (
        <DelayShow delay={500}>
          <Loading />
        </DelayShow>
      );
    }
  },
  timeout: 8000
});

export type PostViewProps = RouteComponentProps<{ path: string }>;

export interface PostViewState {
  content?: string;
  imgPreviewSrc?: string;
  imgOrigin?: ClientRect;
  imgNatural?: {
    height: number;
    width: number;
  };
}

@observer
export default class PostView extends React.Component<
  PostViewProps,
  PostViewState
> {
  @inject('post') post!: AsyncData<string, string>;
  postViewRef = React.createRef<HTMLDivElement>();

  constructor(props: PostViewProps) {
    super(props);
    this.state = {};
    this.loadPost = this.loadPost.bind(this);
    this.handlePreviewImg = this.handlePreviewImg.bind(this);
    this.handleClosePreviewImg = this.handleClosePreviewImg.bind(this);
  }
  loadPost() {
    const { path } = this.props.match.params;
    if (
      this.post.extra === path &&
      this.post.asyncStstus === ASYNC_STATUS.SUCCESS
    ) {
      return;
    }
    this.post.extra = path;
    this.post.waitData(PostFetchServices.get(join('/', path)));
  }
  componentDidMount() {
    this.postViewRef.current!.addEventListener('click', this.handlePreviewImg);
    this.loadPost();
  }
  componentWillUnmount() {
    this.postViewRef.current!.removeEventListener(
      'click',
      this.handlePreviewImg
    );
    this.post.reset();
  }
  handlePreviewImg(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && target.tagName.toLowerCase() === 'img') {
      const origin = target.getBoundingClientRect();

      this.setState({
        imgPreviewSrc: target.src,
        imgOrigin: origin,
        imgNatural: {
          width: target.naturalWidth,
          height: target.naturalHeight
        }
      });
    }
  }
  handleClosePreviewImg() {
    this.setState({
      imgPreviewSrc: undefined
    });
  }
  asyncRender() {
    const { error, data, asyncStstus } = this.post;
    const { path } = this.props.match.params;
    switch (asyncStstus) {
      case ASYNC_STATUS.LOADING: {
        return (
          <DelayShow delay={500}>
            <Loading />
          </DelayShow>
        );
      }
      case ASYNC_STATUS.ERROR: {
        return <Error error={error!} retry={this.loadPost} />;
      }
      case ASYNC_STATUS.INIT: {
        return null;
      }
    }
    const { meta, content } = separateMarkdownMeta(data!);
    return (
      <>
        <Title title={`${meta.title} - ${BLOG_INFO.BLOG_INFO.title}`} />
        <h1>{meta.title}</h1>
        <PostMeta meta={meta} />
        <Post content={content} postPath={path} />
      </>
    );
  }
  render() {
    return (
      <div ref={this.postViewRef} className="blog-view post-view">
        {this.asyncRender()}
        <ImgPreview
          src={this.state.imgPreviewSrc}
          origin={this.state.imgOrigin}
          natural={this.state.imgNatural}
          onClose={this.handleClosePreviewImg}
        />
      </div>
    );
  }
}
