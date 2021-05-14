import React from 'react';
import ContentLoader, {
  Rect,
  IContentLoaderProps,
} from 'react-content-loader/native';

const RkiDataLoader = (props: IContentLoaderProps) => (
  <ContentLoader
    speed={2}
    width="250"
    height="400"
    viewBox="0 0 250 400"
    {...props}>
    <Rect x="0" y="0" rx="3" ry="3" width="250" height="24" />
    <Rect x="25" y="70" rx="10" ry="10" width="200" height="20" />
    <Rect x="25" y="110" rx="10" ry="10" width="200" height="20" />
    <Rect x="25" y="150" rx="10" ry="10" width="200" height="20" />
    <Rect x="25" y="190" rx="10" ry="10" width="200" height="20" />
    <Rect x="25" y="230" rx="10" ry="10" width="200" height="20" />
  </ContentLoader>
);

export default RkiDataLoader;
