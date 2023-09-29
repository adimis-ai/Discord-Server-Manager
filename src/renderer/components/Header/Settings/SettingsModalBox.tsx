import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // Import the Select component
import "./SettingsBox.css"
import { FaUserCircle } from 'react-icons/fa';

interface SettingsModalBoxProps {
  onClose: () => void;
}

const textSizeOptions = [
  { value: 2.0, label: 'Extra Large' },
  { value: 1.6, label: 'Large' },
  { value: 1.0, label: 'Medium' },
  { value: 0.8, label: 'Small' },
  { value: 0.5, label: 'Very Small' },
];

const imageSizeOptions = [
  { value: 2.0, label: 'Extra Large' },
  { value: 1.6, label: 'Large' },
  { value: 1.0, label: 'Medium' },
  { value: 0.8, label: 'Small' },
  { value: 0.5, label: 'Very Small' },
];

interface SettingsModalBoxProps {
  onClose: () => void;
}

const SettingsModalBox: React.FC<SettingsModalBoxProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const userID = window.electron.store.get("userID")
  const userName = window.electron.store.get("userName")
  const userBio = window.electron.store.get("userBio")
  const userAvatar = window.electron.store.get("userAvatar")
  const userBanner = window.electron.store.get("userBanner")
  const userDiscriminator = window.electron.store.get("userDiscriminator")

  const handleTextSizeChange = (option: any) => {
    setTextSize(option.value);
  };

  const handleImageSizeChange = (option: any) => {
    setImageSize(option.value);
  };

  const handleReportIssues = () => {
    window.open("https://github.com/adimis-ai/simplifids/issues", "_blank");
  };
  
  // Inside the SettingsModalBox component
  const [textSize, setTextSize] = useState(window.electron.store.get("textSize") || 1.0);
  const [imageSize, setImageSize] = useState(window.electron.store.get("imageSize") || 1.0);

  useEffect(() => {
    window.electron.store.set("textSize", textSize);
    window.electron.store.set("imageSize", imageSize);
  }, [textSize, imageSize]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await window.electron.store.reset()
      await window.electron.ipcRenderer.cache.clearMessageCache()
      await window.electron.ipcRenderer.cache.clearServerCache()
      await window.electron.ipcRenderer.discordBot.stopDiscordService();
      onClose();
      navigate("/auth");
    } catch (error) {
      // An error happened.
      console.error(error);
    } finally {
      setLogoutLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

      <div className="user-banner" style={{ backgroundImage: `url(${userBanner})` }}>
        <div className="avatar-wrapper">
          {userAvatar ? (
            <img className="user-avatar" src={userAvatar} alt={`${userName}'s avatar`} />
          ) : (
            <FaUserCircle className="user-avatar" />
          )}
        </div>
      </div>

        <div className="user-details">
          <h2 className="user-NAME">{userName}<span className="user-discriminator">#{userDiscriminator}</span></h2>
          <p className="user-bio">{userBio}</p>
        </div>


        <div className="select-container">

          <div className='select-body'>
            <label className='select-label'>
              Text Size
            </label>
            <Select
              options={textSizeOptions}
              value={textSizeOptions.find(option => option.value === textSize)}
              onChange={handleTextSizeChange}
            />
          </div>

          <div className='select-body'>
          <label className='select-label'>
            Image Size
          </label>
          <Select
              options={imageSizeOptions}
              value={imageSizeOptions.find(option => option.value === imageSize)}
              onChange={handleImageSizeChange}
            />
          </div>

        </div>

        <div>
          <button className="settings-button" onClick={handleReportIssues}>
            Report Issues
          </button>
          <button className="settings-button" onClick={handleLogout} disabled={logoutLoading}>
            {logoutLoading ? 'Logging Out...' : 'Logout'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModalBox;

