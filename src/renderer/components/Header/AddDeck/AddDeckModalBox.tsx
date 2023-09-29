import React, { FormEvent, useState, useEffect } from 'react';
import { addDeck } from '../../../reducers/deckManager';
import { useDispatch, useSelector } from 'react-redux';
import './AddDeckModal.css';
import { ServerData } from '../../../modules/types';
import { fetchAndUpdateMessages } from '../../../modules/messages/handleMessages';
import { getServer, searchMember } from '../../../modules/api/apiHandler';
import Select from 'react-select';
import Loader from '../../Extra/Loader'
import AsyncSelect from 'react-select/async';

interface AddDeckModalBoxProps {
  onClose: () => void;
  onAddDeck: (newDeck: [string, string, string | null, string | null]) => void;
}

const AddDeckModalBox: React.FC<AddDeckModalBoxProps> = ({ onClose, onAddDeck }) => {
  const dispatch = useDispatch();
  const serverDataInStore = useSelector((state: any) => state.serverData);

  const [addingDeck, setAddingDeck] = useState(false);
  const [server, setServer] = useState<{ value: string, label: string } | null>(null);
  const [channel, setChannel] = useState<{ value: string, label: string } | null>(null);
  const [userData, setUserData] = useState<[{ value: string, label: string}] | null >(null);
  const [user, setUser] = useState<{ value: string, label: string } | null>(null);
  const [selectedUser, selectUser] = useState<{ value: string, label: string } | null>(null);
  
  const [loading, setLoading] = useState(false);

  const createDeckID = (serverID: string | null, channelID: string | null, memberID: string | null) => {
    return [serverID ?? 'null', channelID ?? 'null', memberID ?? 'null'].join('/');
  };

  const handleAddDeck = async (server: string, channel: string | null, member: string | null) => {
    return new Promise(async(resolve,reject)=>{

  console.log("handleAddDeck",server, channel,member)
    const serverData:any = fetchedServerData.find((serverData) => serverData.serverName === server);
    console.log("serverData",serverData)
    const serverId = serverData?.serverId ?? '';
    console.log("serverId",serverId)
    const channelData = serverData?.channels.find((channelData) => channelData.channelName === channel);
    console.log("channelData",channelData)
    const channelId = channelData?.channelId ?? null;
    console.log("channelId",channelId)
    const deckId = createDeckID(serverId, channelId, member);
    console.log("deckId",deckId)
    const messageData = await fetchAndUpdateMessages(deckId, "0", dispatch);
    console.log("messageData",messageData)
    dispatch(addDeck({ id: deckId, server: server, channel: channel, user: member, messages: messageData }));
  

    resolve(deckId)
  })
  };  

  const loadOptions = async (inputValue: string) => {
    console.log("loadOptions",inputValue)
    console.log("server",server)
    if (inputValue && server) {
      console.log("fetchedServerData",fetchedServerData)
      const serverData = fetchedServerData.find((data) => data.serverName === server.value);
      console.log("serverData",serverData)
      // const serverId = serverData?.serverId ?? '';
      console.log("serverData.members = ",serverData.members)
      let membersArray:any = []
      serverData.members.map((item)=>{
        membersArray.push({value:item.memberId,label:item.memberName})
      })
      console.log("membersArray = ",membersArray)
      setUserData(membersArray)
      console.log("userData = ",userData)
            // const members = await window.electron.ipcRenderer.discordBot.searchMember(serverId, inputValue);
            // console.log("searchedMembers: ", members)
            // return members.map((member: {memberId: string, memberName: string}) => ({ value: member.memberId, label: member.memberName }));
        
    }else{
      setUserData([{value:"none",label:'none'}])
    }
  };  

  async function fetchAndUpdateServer(): Promise<any> {
    // Check if server data is available in the Redux store
    if (serverDataInStore && serverDataInStore.length > 0) {
      return serverDataInStore;
    } else {
      try {
        const server = await getServer();
        return server;
      } catch (error) {
        return null;
      }
    }
  }

  // Add a new state to store the fetched serverData
  const [fetchedServerData, setFetchedServerData] = useState<ServerData[]>([]);

  // Fetch server data using fetchAndUpdateServer function
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const serverData = await fetchAndUpdateServer();
      setFetchedServerData(serverData);
      setLoading(false);
      [{ value: 'None', label: 'None' }, ...fetchedServerData.find((data) => data.serverName === server?.value)?.channels.map((channel) => ({ value: channel.channelName, label: channel.channelName })) || []]
    };

    fetchData();

    window.electron.ipcRenderer.on("MEMBERS_RECIVED",(members:any)=>{

    })
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("selectedUser ===" ,user)
    if (server) {
      setAddingDeck(true);
      console.log("Adding Deck: ",
        server.value,
        channel?.value || null,
        user?.value || null
      )
      const deckId:any = await handleAddDeck(server.value, channel?.value || null, user?.value || null);
      console.log(deckId)
      onAddDeck([deckId, server.value, channel?.value || null, user?.value || null]);
      setAddingDeck(false);
      onClose();
    }
  };
  
  function setServer1(selectedOption){

console.log("selectedOption",selectedOption)
setServer(selectedOption)
  }

  function setChannel1(selectedOption){
    console.log("selectedOption",selectedOption)
    setChannel(selectedOption?.value === 'None' ? null : selectedOption)
    loadOptions(selectedOption?.value)
  }

  const loadOptions1 = async (inputValue: string) => {
    if (inputValue && server) {
      const serverData = fetchedServerData.find((data) => data.serverName === server.value);
      const serverId = serverData?.serverId ?? '';
  
      const members = await window.electron.ipcRenderer.discordBot.searchMember(serverId, inputValue);
      console.log("searchedMembers: ", members)
      return members.map((member: {memberId: string, memberName: string}) => ({ value: member.memberId, label: member.memberName }));
    }
    return [];
  };  

  return (

    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add a new deck</h2>
        {
          loading || fetchedServerData.length === 0 || addingDeck ? (
              <Loader/>
            ) : (
            <form className='form-label' onSubmit={handleSubmit}>
              
              <div className='inputGroup'>
                <label htmlFor="server" className='inputGroup_label'>Server:</label>
                <Select
                  id="server"
                  className='inputGroup_input'
                  value={server}
                  onChange={(selectedOption) => setServer1(selectedOption)}
                  options={fetchedServerData.map((data) => ({ value: data.serverName, label: data.serverName }))}
                  isSearchable
                />
              </div>

              <div className='inputGroup'>
                <label htmlFor="channel" className='inputGroup_label'>Channel</label>
                <Select
                  id="channel"
                  className='inputGroup_input'
                  value={channel}
                  onChange={(selectedOption) => setChannel1(selectedOption)}
                  options={[{ value: 'None', label: 'None' }, ...fetchedServerData.find((data) => data.serverName === server?.value)?.channels.map((channel) => ({ value: channel.channelName, label: channel.channelName })) || []]}
                  isSearchable
                />
              </div>

              {/* <div className='inputGroup'>
              <label htmlFor="user" className='inputGroup_label'>User (optional):</label>
              <Select
                  id="channel"
                  className='inputGroup_input'
                  value={selectedUser}
                  onChange={(selectedOption) => selectUser(selectedOption)}
                  options={userData}
                  isSearchable
                />
                </div> */}

              <div className='inputGroup'>
                <label htmlFor="user" className='inputGroup_label'>User (optional):</label>
                <AsyncSelect
                  key={server?.value + channel?.value}
                  id="user"
                  className='inputGroup_input'
                  value={user}
                  options={userData}
                  loadOptions={loadOptions1}
                  onChange={(selectedOption) => setUser(selectedOption)}
                  defaultOptions
                />
              </div>

              <button type="submit">Add Deck</button>
              <button className="modal-close-button" onClick={onClose}>
                x
              </button>
            </form>
          )
        }
      </div>
    </div>

  );
};

export default AddDeckModalBox;