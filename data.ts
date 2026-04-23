import { PlatformInfo, Service } from "../types";

export const platforms: PlatformInfo[] = [
  { id: 'tiktok', name: 'TikTok', color: 'text-pink-400', bgColor: 'bg-pink-950', borderColor: 'border-pink-500' },
  { id: 'youtube', name: 'YouTube', color: 'text-red-400', bgColor: 'bg-red-950', borderColor: 'border-red-500' },
  { id: 'instagram', name: 'Instagram', color: 'text-purple-400', bgColor: 'bg-purple-950', borderColor: 'border-purple-500' },
  { id: 'telegram', name: 'Telegram', color: 'text-sky-400', bgColor: 'bg-sky-950', borderColor: 'border-sky-500' },
  { id: 'facebook', name: 'Facebook', color: 'text-blue-400', bgColor: 'bg-blue-950', borderColor: 'border-blue-500' },
  { id: 'twitter', name: 'Twitter / X', color: 'text-cyan-400', bgColor: 'bg-cyan-950', borderColor: 'border-cyan-500' },
];

export const services: Service[] = [
  // TikTok
  { id: 'tt-1', name: 'TikTok Followers', platform: 'tiktok', category: 'Followers', rate: 0.05, min: 100, max: 100000, provider: 'BoostMaster', description: 'High quality followers, no drop guarantee', averageTime: '0-6 hours' },
  { id: 'tt-2', name: 'TikTok Likes', platform: 'tiktok', category: 'Likes', rate: 0.02, min: 50, max: 500000, provider: 'SocialWave', description: 'Instant likes from real accounts', averageTime: '0-1 hour' },
  { id: 'tt-3', name: 'TikTok Views', platform: 'tiktok', category: 'Views', rate: 0.001, min: 500, max: 10000000, provider: 'ViewStorm', description: 'Fast views delivery, global mix', averageTime: '0-30 min' },
  { id: 'tt-4', name: 'TikTok Shares', platform: 'tiktok', category: 'Shares', rate: 0.03, min: 100, max: 50000, provider: 'BoostMaster', description: 'Real shares to boost reach', averageTime: '0-2 hours' },
  { id: 'tt-5', name: 'TikTok Comments', platform: 'tiktok', category: 'Comments', rate: 0.10, min: 10, max: 10000, provider: 'SocialWave', description: 'Custom comments available', averageTime: '0-4 hours' },
  { id: 'tt-6', name: 'TikTok Saves', platform: 'tiktok', category: 'Saves', rate: 0.04, min: 50, max: 50000, provider: 'ViewStorm', description: 'Increase save count', averageTime: '0-3 hours' },

  // YouTube
  { id: 'yt-1', name: 'YouTube Subscribers', platform: 'youtube', category: 'Subscribers', rate: 0.08, min: 50, max: 50000, provider: 'BoostMaster', description: 'Real channel subscribers', averageTime: '0-12 hours' },
  { id: 'yt-2', name: 'YouTube Views', platform: 'youtube', category: 'Views', rate: 0.003, min: 500, max: 1000000, provider: 'ViewStorm', description: 'High retention views', averageTime: '0-24 hours' },
  { id: 'yt-3', name: 'YouTube Likes', platform: 'youtube', category: 'Likes', rate: 0.03, min: 50, max: 100000, provider: 'SocialWave', description: 'Video likes from real users', averageTime: '0-6 hours' },
  { id: 'yt-4', name: 'YouTube Watch Time', platform: 'youtube', category: 'Watch Time', rate: 0.50, min: 100, max: 4000, provider: 'BoostMaster', description: 'Hours of watch time for monetization', averageTime: '1-7 days' },
  { id: 'yt-5', name: 'YouTube Comments', platform: 'youtube', category: 'Comments', rate: 0.15, min: 10, max: 5000, provider: 'SocialWave', description: 'Positive custom comments', averageTime: '0-8 hours' },
  { id: 'yt-6', name: 'YouTube Shorts Views', platform: 'youtube', category: 'Views', rate: 0.002, min: 1000, max: 5000000, provider: 'ViewStorm', description: 'Shorts specific views', averageTime: '0-12 hours' },

  // Instagram
  { id: 'ig-1', name: 'Instagram Followers', platform: 'instagram', category: 'Followers', rate: 0.04, min: 100, max: 100000, provider: 'BoostMaster', description: 'Premium quality followers', averageTime: '0-6 hours' },
  { id: 'ig-2', name: 'Instagram Likes', platform: 'instagram', category: 'Likes', rate: 0.015, min: 50, max: 500000, provider: 'SocialWave', description: 'Post likes instant delivery', averageTime: '0-30 min' },
  { id: 'ig-3', name: 'Instagram Views', platform: 'instagram', category: 'Views', rate: 0.001, min: 500, max: 10000000, provider: 'ViewStorm', description: 'Reel & story views', averageTime: '0-15 min' },
  { id: 'ig-4', name: 'Instagram Comments', platform: 'instagram', category: 'Comments', rate: 0.12, min: 10, max: 5000, provider: 'BoostMaster', description: 'Relevant custom comments', averageTime: '0-4 hours' },
  { id: 'ig-5', name: 'Instagram Saves', platform: 'instagram', category: 'Saves', rate: 0.03, min: 50, max: 50000, provider: 'SocialWave', description: 'Post saves for algorithm boost', averageTime: '0-2 hours' },
  { id: 'ig-6', name: 'Instagram Story Views', platform: 'instagram', category: 'Views', rate: 0.002, min: 100, max: 100000, provider: 'ViewStorm', description: 'Story views from real accounts', averageTime: '0-1 hour' },

  // Telegram
  { id: 'tg-1', name: 'Telegram Members', platform: 'telegram', category: 'Members', rate: 0.03, min: 100, max: 200000, provider: 'BoostMaster', description: 'Group/channel members', averageTime: '0-12 hours' },
  { id: 'tg-2', name: 'Telegram Views', platform: 'telegram', category: 'Views', rate: 0.001, min: 500, max: 5000000, provider: 'ViewStorm', description: 'Post views fast delivery', averageTime: '0-15 min' },
  { id: 'tg-3', name: 'Telegram Reactions', platform: 'telegram', category: 'Reactions', rate: 0.02, min: 50, max: 50000, provider: 'SocialWave', description: 'Emoji reactions on posts', averageTime: '0-1 hour' },
  { id: 'tg-4', name: 'Telegram Shares', platform: 'telegram', category: 'Shares', rate: 0.04, min: 50, max: 20000, provider: 'BoostMaster', description: 'Post shares/forwards', averageTime: '0-3 hours' },
  { id: 'tg-5', name: 'Telegram Online Members', platform: 'telegram', category: 'Members', rate: 0.10, min: 50, max: 5000, provider: 'SocialWave', description: 'Always online members', averageTime: '0-24 hours' },

  // Facebook
  { id: 'fb-1', name: 'Facebook Page Likes', platform: 'facebook', category: 'Likes', rate: 0.05, min: 100, max: 100000, provider: 'BoostMaster', description: 'Page likes/followers', averageTime: '0-12 hours' },
  { id: 'fb-2', name: 'Facebook Post Likes', platform: 'facebook', category: 'Likes', rate: 0.02, min: 50, max: 50000, provider: 'SocialWave', description: 'Reaction likes on posts', averageTime: '0-2 hours' },
  { id: 'fb-3', name: 'Facebook Views', platform: 'facebook', category: 'Views', rate: 0.002, min: 500, max: 1000000, provider: 'ViewStorm', description: 'Video views high retention', averageTime: '0-6 hours' },
  { id: 'fb-4', name: 'Facebook Followers', platform: 'facebook', category: 'Followers', rate: 0.06, min: 100, max: 50000, provider: 'BoostMaster', description: 'Profile followers', averageTime: '0-8 hours' },
  { id: 'fb-5', name: 'Facebook Shares', platform: 'facebook', category: 'Shares', rate: 0.04, min: 50, max: 20000, provider: 'SocialWave', description: 'Post shares for reach', averageTime: '0-4 hours' },

  // Twitter
  { id: 'tw-1', name: 'Twitter Followers', platform: 'twitter', category: 'Followers', rate: 0.06, min: 100, max: 100000, provider: 'BoostMaster', description: 'Profile followers real looking', averageTime: '0-6 hours' },
  { id: 'tw-2', name: 'Twitter Likes', platform: 'twitter', category: 'Likes', rate: 0.02, min: 50, max: 100000, provider: 'SocialWave', description: 'Tweet likes instant', averageTime: '0-1 hour' },
  { id: 'tw-3', name: 'Twitter Retweets', platform: 'twitter', category: 'Retweets', rate: 0.04, min: 50, max: 50000, provider: 'BoostMaster', description: 'Retweets to amplify reach', averageTime: '0-3 hours' },
  { id: 'tw-4', name: 'Twitter Views', platform: 'twitter', category: 'Views', rate: 0.001, min: 1000, max: 5000000, provider: 'ViewStorm', description: 'Tweet impressions/views', averageTime: '0-30 min' },
  { id: 'tw-5', name: 'Twitter Comments', platform: 'twitter', category: 'Comments', rate: 0.12, min: 10, max: 5000, provider: 'SocialWave', description: 'Custom tweet replies', averageTime: '0-4 hours' },
];

export const providers = [
  { id: 'BoostMaster', name: 'BoostMaster', rating: 4.8, completed: 1250000, color: 'text-amber-400' },
  { id: 'SocialWave', name: 'SocialWave', rating: 4.6, completed: 890000, color: 'text-emerald-400' },
  { id: 'ViewStorm', name: 'ViewStorm', rating: 4.5, completed: 2100000, color: 'text-violet-400' },
];