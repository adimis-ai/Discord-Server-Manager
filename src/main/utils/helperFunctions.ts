export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function handleNull(value: string | null): string | null {
  if (value === null || value === 'null') {
    return null;
  }
  return value;
}

export const createDeckID = (serverID: string | null, channelID: string | null, memberID: string | null) => {
  return [serverID ?? 'null', channelID ?? 'null', memberID ?? 'null'].join('/');
};

export const printData = (functionName: string, serverID: string, channelID: string | null, memberID: string): void => {
  console.log(
      `## ====== ${functionName} ====== ##`, 
      "\nserverID: ", serverID, 
      "\nchannelID: ", channelID, 
      "\nmemberID: ", memberID, 
      `\n## ====== ${functionName} ====== ##\n`, 
  );
}

export async function replaceAsync(str, regex, asyncFn) {
  const promises = []; 
  str.replace(regex, (match, ...args) => {
      const promise = asyncFn(match, ...args);
      promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

export const fetchURLGenerator = (serverID: string, offset: string, channelID: string | null, memberID: string | null): string => {
  const params = new URLSearchParams();
  if (channelID && channelID.toLowerCase() !== 'null') params.append('channel_id', channelID);
  if (memberID && memberID.toLowerCase() !== 'null') params.append('author_id', memberID);
  params.append('offset', offset);

  const url = `https://discord.com/api/v9/guilds/${serverID}/messages/search?${params.toString()}`
  printData('fetchURLGenerator', serverID, channelID, memberID);
  return url;
}

export const fetchURLGeneratorNew = (serverID: string, offset: string, channelID: string | null, memberID: string | null): string => {
  // https://discord.com/api/v9/guilds/947068400407019531/messages/search?author_id=765611936908968007
  const url = `https://discord.com/api/v9/guilds/${serverID}/messages/search?channel_id=${channelID}&author_id=${memberID}`
  printData('fetchURLGenerator', serverID, channelID, memberID);
  return url;
}