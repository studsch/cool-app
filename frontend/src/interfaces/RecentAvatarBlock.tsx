interface RecentAvatarBlockProps {
  key?: any;
  text: string;
  img: string;
  classNames?: {
    avatar?: { base?: string; fallback?: string; img?: string };
    text?: { base?: string };
  };
}

export default RecentAvatarBlockProps;
