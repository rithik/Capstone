import React, {useState} from 'react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

function GroupChatTags(){
const [tags, setTags] =  useState([]);
return (<TagsInput value={tags} onChange={(newTags) => setTags(newTags)} />);
}
export default GroupChatTags;