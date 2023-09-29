export interface MessageData {
  id: string;
  type: number;
  content: string;
  channel_id: string;
  author: {
    id: string;
    username: string;
    global_name: null | string;
    display_name: null | string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    avatar_decoration: null | string;
  };
  attachments: any[];
  embeds: any[];
  mentions: any[];
  mention_roles: any[];
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
  timestamp: string;
  edited_timestamp: null | string;
  flags: number;
  components: any[];
  message_reference: {
    channel_id: string;
    guild_id: string;
    message_id: string;
  };
  hit: boolean;
  images: any[];
  authorName: string;
  authorId: string;
  channelId: string;
  channelName: string;
  guildId: string;
  roleColor: string;
  reply: {
    content: string;
    authorId: string;
    authorName: string;
  };
  reactions: {
    id: string;
    count: number;
  }[];
  createdTimestamp: string;
  avatarURL: string;
}
  
export interface ServerData {
    serverId: string;
    serverName: string;
    channels: {
      channelId: string;
      channelName: string;
    }[];
    members: {
      memberId: string;
      memberName: string;
    }[];
}