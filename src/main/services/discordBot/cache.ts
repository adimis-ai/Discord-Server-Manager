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
export interface DecksCache {
    [deckID: string]: {
      serverId: string;
      channelId: string | null;
      memberId: string | null;
      messages: {
        [msgId: string]: {
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
        };
      };
      offsetZero: {
        [msgId: string]: {
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
        };
      };
      lastOffset: number;
    };
}  

class DecksCacheStorage {
    private cache: DecksCache = {};

    public updateReactions(serverId: string, channelId: string, memberId: string, msgId: string, reactions: MessageData['reactions']): void {
        const deckIDs = Object.keys(this.cache);
    
        for (const deckID of deckIDs) {
            const deck = this.cache[deckID];
            if (
                deck.serverId === serverId ||
                deck.channelId === channelId ||
                deck.memberId === memberId
            ) {
                // Update the reaction in offsetZero and messages
                if (deck.messages[msgId]) {
                    deck.messages[msgId].reactions = reactions;
                }
    
                if (deck.offsetZero[msgId]) {
                    deck.offsetZero[msgId].reactions = reactions;
                }
            }
        }
    }

    public pushMessageToOffsetZero(serverId: string, channelId: string, memberId: string, latestMessage: MessageData): void {
        const deckIDs = Object.keys(this.cache);
        for (const deckID of deckIDs) {
            const deck = this.cache[deckID];
    
            // All three ids match
            if (deck.serverId === serverId && deck.channelId === channelId && deck.memberId === memberId) {
                deck.offsetZero[latestMessage.id] = latestMessage;
            } 
            // serverId and channelId match, memberId is null in the deck
            else if (deck.serverId === serverId && deck.channelId === channelId && deck.memberId === null) {
                deck.offsetZero[latestMessage.id] = latestMessage;
            }
            // serverId and memberId match, channelId is null in the deck
            else if (deck.serverId === serverId && deck.channelId === null && deck.memberId === memberId) {
                deck.offsetZero[latestMessage.id] = latestMessage;
            }
            // Only serverId matches, both channelId and memberId are null in the deck
            else if (deck.serverId === serverId && deck.channelId === null && deck.memberId === null) {
                deck.offsetZero[latestMessage.id] = latestMessage;
            }
            // serverId matches, channelId and memberId are not null in the deck but they do not match with latestMessage's channelId and memberId
            else if (deck.serverId === serverId && deck.channelId !== null && deck.memberId !== null && (deck.channelId !== channelId || deck.memberId !== memberId)) {
                continue;
            }
        }
    }

    public addOldMessages(deckID: string, messages: DecksCache[typeof deckID]['messages']) {
        const deck = this.getDeck(deckID);
        if (deck) {
            const oldMessages = deck.messages;
            const newMessages = { ...oldMessages, ...messages };

            const oldOffsetZero = deck.offsetZero;
            const newOffsetZero = { ...oldOffsetZero, ...messages };

            deck.offsetZero = newOffsetZero;
            deck.messages = newMessages;
            this.setDeck(deckID, deck);
        }
    }

    public getDeck(deckID: string): DecksCache[typeof deckID] | undefined {
        return this.cache[deckID];
    }

    public setDeck(deckID: string, deckData: DecksCache[typeof deckID]): void {
        this.cache[deckID] = deckData;
    }

    public getDeckIds(): string[] {
        return Object.keys(this.cache);
    }

    public deleteDeck(deckID: string): void {
        delete this.cache[deckID];
    }

    public getDecks(): DecksCache {
        return this.cache;
    }

    public clearCache(): void {
        this.cache = {};
    }
        
    public addMessages(deckID: string, messages: DecksCache[typeof deckID]['messages'], offset: number): void {
        const deck = this.getDeck(deckID);
        if (deck) {
            deck.offsetZero = messages;
            this.setDeck(deckID, deck);
        }
    }     

    public addMessagesWhenChannelNull(serverId: string, memberId: string, messages: DecksCache[typeof serverId]['messages']): void {
        const deckIDs = Object.keys(this.cache);
        for (const deckID of deckIDs) {
            const deck = this.cache[deckID];
            if (deck.serverId === serverId && deck.channelId === null && deck.memberId === memberId) {
                deck.offsetZero = messages;
                this.setDeck(deckID, deck);
            }
        }
    }
    
    public addMessagesToNewDeck(deckID: string, messages: DecksCache[typeof deckID]['messages'], offset: number): void {
        const [serverID, channelID, memberId] = deckID.split('/');
        this.setDeck(deckID, {
            serverId: serverID,
            channelId: channelID,
            memberId: memberId,
            messages,
            offsetZero: messages,
            lastOffset: 0,
        });
    }
    
    public getMessages(deckID: string, offset: number):any[] {
        const deck = this.getDeck(deckID);
        if (!deck) return [];
        const messagesArray = Object.values(deck.offsetZero);
        const sortedMessages = messagesArray.sort((a, b) => new Date(a.createdTimestamp).getTime() - new Date(b.createdTimestamp).getTime()).reverse();
        return sortedMessages;
    }    

    public getMessagesIfChannelNull(serverId: string, memberId: string): any[] {
        const deckIDs = Object.keys(this.cache);
        for (const deckID of deckIDs) {
            const deck = this.cache[deckID];
            if (deck.serverId === serverId && deck.channelId === null && deck.memberId === memberId) {
                const messagesArray = Object.values(deck.offsetZero);
                const sortedMessages = messagesArray.sort((a, b) => new Date(a.createdTimestamp).getTime() - new Date(b.createdTimestamp).getTime()).reverse();
                return sortedMessages;
            }
        }
        return [];
    }

    public updateLastOffset(deckID: string, lastOffset: number): void {
        const deck = this.getDeck(deckID);
        if (deck) {
            deck.lastOffset = lastOffset;
            this.setDeck(deckID, deck);
        }
    }

    public deleteMessage(deckID: string, msgId: string): void {
        const deck = this.getDeck(deckID);
        if (deck) {
            delete deck.messages[msgId];
            this.setDeck(deckID, deck);
        }
    }

    public getLastOffset(deckID: string): number | null {
        const deck = this.getDeck(deckID);
        if (deck) {
            return deck.lastOffset;
        }
        return null;
    }

    public getNumberOfMessages(deckID: string): number {
        const deck = this.getDeck(deckID);
        if (deck) {
            return Object.keys(deck.messages).length;
        }
        return 0;
    }
    
    public createNewDeck(deckID: string): void {
        const [serverId, channelID, memberID] = deckID.split("/");
        const channelId = channelID === "null" ? null : channelID;
        const memberId = memberID === "null" ? null : memberID;

        this.setDeck(deckID, {
            serverId,
            channelId,
            memberId,
            messages: {},
            offsetZero: {},
            lastOffset: 0,
        });
    }

    public serverExistsInDecks(serverId: string): boolean {
        const deckIDs = Object.keys(this.cache);
        for (const deckID of deckIDs) {
          const deck = this.cache[deckID];
          if (deck.serverId === serverId) {
            return true;
          }
        }
        return false;
    }

    public getNumberofMessagesInOffsetZero(deckID: string): number {
        const deck = this.getDeck(deckID);
        if (deck) {
            return Object.keys(deck.offsetZero).length;
        }
        return 0;
    }
    
    public deleteMessageFromAllDecks(msgID: string): void {
        const deckIds = this.getDeckIds();
        deckIds.forEach(deckID => {
            const deck = this.getDeck(deckID);
            if (deck) {
                // Delete the message from messages
                if (deck.messages[msgID]) {
                    delete deck.messages[msgID];
                }

                // Delete the message from offsetZero
                if (deck.offsetZero[msgID]) {
                    delete deck.offsetZero[msgID];
                }

                // Save the updated deck back to the cache
                this.setDeck(deckID, deck);
            }
        });
    }
}

export const decksCacheStorage = new DecksCacheStorage();

export interface ServerDataCache {
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

class ServerDataCacheStorage {
    private cache: ServerDataCache[] = [];
    
    public getServer(serverId: string): ServerDataCache | undefined {
        return this.cache.find((server) => server.serverId === serverId);
    }

    public setServer(serverId: string, serverData: ServerDataCache): void {
        const serverIndex = this.cache.findIndex((server) => server.serverId === serverId);
        if (serverIndex !== -1) {
            this.cache[serverIndex] = serverData;
        } else {
            this.cache.push(serverData);
        }
    }

    public deleteServer(serverId: string): void {
        const serverIndex = this.cache.findIndex((server) => server.serverId === serverId);
        if (serverIndex !== -1) {
            this.cache.splice(serverIndex, 1);
        }
    }
    
    public getServers(): ServerDataCache[] {
        return this.cache;
    }

    public clearCache(): void {
        this.cache = [];
    }

    public addChannel(serverId: string, channel: ServerDataCache['channels'][number]): void {
        const server = this.getServer(serverId);
        if (server) {
            const channelIndex = server.channels.findIndex((ch) => ch.channelId === channel.channelId);
            
            // Only add the channel if it doesn't exist
            if (channelIndex === -1) {
                server.channels.push(channel);
                this.setServer(serverId, server);
            }
        }
    }

    public addMember(serverId: string, member: ServerDataCache['members'][number]): void {
        const server = this.getServer(serverId);
        if (server) {
            const memberIndex = server.members.findIndex((m) => m.memberId === member.memberId);
    
            // If member does not exist, add the member
            if (memberIndex === -1) {
                server.members.push(member);
                this.setServer(serverId, server);
            }
        } else {
            // If the server does not exist, create a new server with this member
            this.setServer(serverId, {
                serverId,
                serverName: "",  // Populate serverName if necessary
                channels: [],  // Populate channels if necessary
                members: [member],
            });
        }
    }  

    public getMemberName(memberId: string): string | undefined {
        // Loop through all servers
        for (let server of this.cache) {
            // Find the member in the server's members array
            let member = server.members.find(member => member.memberId === memberId);
            
            // If the member is found, return their name
            if (member) {
                return member.memberName;
            }
        }
    
        // If the member is not found in any server, return undefined
        return undefined;
    }    
} 

export const serverDataCacheStorage = new ServerDataCacheStorage();
