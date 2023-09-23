// import React, { useEffect, useRef } from "react";
// import ScrollableFeed from "react-scrollable-feed";
// import {
//   isLastMessage,
//   isSameSender,
//   isSameSenderMargin,
//   isSameUser,
// } from "../../config/logics";
// import { useChat } from "../../context/ChatContext";
// import { Avatar, Tooltip } from "@chakra-ui/react";

// export default function ScrollableChat({ messages }) {
//   const { user } = useChat();

//   return (
//     <div >
//       <ScrollableFeed  >
//         {messages &&
//           messages.map((m, i) => {
//             return (
//               <div  style={{ display: "flex" }} key={m._id}>
//                 {(isSameSender(messages, m, i, user?._id) ||
//                   isLastMessage(messages, i, user?._id)) && (
//                   <Tooltip
//                     label={m.sender.name}
//                     placement="bottom-start"
//                     hasArrow
//                   >
//                     <Avatar
//                       mt={"7px"}
//                       mr={1}
//                       size={"sm"}
//                       cursor={"pointer"}
//                       name={m.sender.name}
//                       src={m.sender.pic}
//                     ></Avatar>
//                   </Tooltip>
//                 )}
//                 <span
//                   style={{
//                     backgroundColor: `${
//                       m.sender._id === user?._id ? "#BEE3F4" : "#B9F5D0"
//                     }`,
//                     borderRadius: "20px",
//                     padding: "5px 15px",
//                     maxWidth: "75%",
//                     marginLeft: isSameSenderMargin(messages, m, i, user?._id),
//                     marginTop: isSameUser(messages, m, i, user?._id) ? 3 : 10,
//                   }}
//                 >
//                   {m.content}
//                 </span>
//               </div>
//             );
//           })}
//       </ScrollableFeed>
//     </div>
//   );
// }

// ///////////////////////////////////

import React, { useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/logics";
import { useChat } from "../../context/ChatContext";
import { Avatar, Tooltip } from "@chakra-ui/react";

export default function ScrollableChat({ messages }) {
  const { user } = useChat();

  // Function to scroll to the bottom

  // Automatically scroll to the bottom when new messages are added

  return (
    <div style={{ marginRight: "4px" }}>
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => {
            return (
              <div style={{ display: "flex" }} key={m._id}>
                {(isSameSender(messages, m, i, user?._id) ||
                  isLastMessage(messages, i, user?._id)) && (
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt={"7px"}
                      mr={1}
                      size={"sm"}
                      cursor={"pointer"}
                      name={m.sender.name}
                      src={m.sender.pic}
                    ></Avatar>
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user?._id ? "#BEE3F4" : "#B9F5D0"
                    }`,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                    marginTop: isSameUser(messages, m, i, user?._id) ? 3 : 10,
                  }}
                >
                  {m.content}
                </span>
              </div>
            );
          })}
      </ScrollableFeed>
    </div>
  );
}
