import "./App.css";

import React, { useEffect, useRef, useState } from "react";
import Card from "./components/Card";
import image1 from "./assets/image1.jpg";
import Form from "./components/Form";
import {
  
  MdOutlineArrowBack,
  MdOutlineAttachFile,
} from "react-icons/md";
import { ImAttachment } from "react-icons/im";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillMinusCircle } from "react-icons/ai";

import { MdClose, MdDelete } from 'react-icons/md';
import { IoIosCloseCircle } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import { LuCopyCheck } from "react-icons/lu";
import { CgFileDocument } from "react-icons/cg";
import { LuSend, LuSendHorizonal } from "react-icons/lu";
import waving from "./assets/waving.png";
import makeLogo from "./assets/make-logo.png";
import avatar from "./assets/b.webp";
import exportIcon from "./assets/exportIcon.png";
import TurndownService from "turndown";
import axios from "axios";
import { marked, use } from "marked";
import { FaPen } from "react-icons/fa";
import Header from "./components/Header";

function App() {
  const [validationName, setValidationName] = useState(true);
  const [validationDescription, setValidationDescription] = useState(true);
  const [validationUrl, setValidationUrl] = useState(false);
  const [markdown, setMarkdown]: any = useState("");
  const [markdownData, setMarkdownData]: any = useState("");
  const [fileName, setFileName]: any = useState("Set Your Agent Icon");
  const [activeAgency, setActiveAgent] = useState<any>({});
  const [chatUrl, setChatUrl]: any = useState("");
  const [loading, setLoading]: boolean | any = useState(false);
  const [section, setSection] = useState("startChat");
  const [update, setUpdate]: any = useState(false);
  const [messages, setMessages]: any = useState();
  const [savedItemsAll, setSavedItemsAll]: any = useState();
  const [initalMessage,setInitalMessage]:any=useState(true)
  const defaultMessages = [
    {
      id: 'default1',
      type: 'receiver', // This ensures the messages appear from the receiver side
      text: 'Welcome to the chat! Feel free to ask me anything.',
    },
    {
      id: 'default2',
      type: 'receiver',
      text: 'I can help you with various tasks. Just type your message below.',
    },
  ];

  const [openSavedItems, setOpenSavedItems] = useState(false);
  
  // const [messages, setMessages] = useState([
  //   { id: 1, type: "sender", text: "Hello! How can I assist you today?" },
  //   { id: 2, type: "receiver", text: "Feel free to ask me any questions." },
  // ]);
  const [input, setInput] = useState("");
  const [savedItems, setSavedItems]: any = useState([]);
  const [imageSrc, setImageSrc]: any = useState("");
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [copied, setCopied]: any = useState(false);
  const fileInputRef: any = useRef(null);
  const dropZoneRef = useRef(null);
  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Optional chaining in case files is undefined

    if (file) {
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result as string; // Type assertion
          console.log(base64String, "base64");
          setImageSrc(base64String); // Set image source to the uploaded image
          // Store base64 value in state
        };

        reader.readAsDataURL(file); // Read the file as a data URL
      } else {
        alert("Please select a valid image file."); // Alert for non-image files
      }
    }
  };

  const handleResetImage = () => {
    setImageSrc(""); // Reset image source
    // Reset base64 image state
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input value
    }
  };

  const handleItemClick = (message: any) => {
    setInput((prevInput) => prevInput + message);
    closeModal();
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOverlayVisible(false); // Hide the overlay

    const file = event.dataTransfer.files[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        // Check if the file is an image
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result as string; // Type assertion
          setImageSrc(base64String); // Set image source to the dropped image
        };

        reader.readAsDataURL(file); // Read the file as a data URL
      } else {
        alert("Please drop a valid image file."); // Alert for non-image files
      }
    }
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
    setIsOverlayVisible(true); // Prevent default behavior to allow drop
  };

  // function loadSavedItems(agnetName:any) {
  //   chrome.storage.local.get({ savedItems: [] }, (result) => {
  //     const savedItems = result.savedItems;
  //     console.log(savedItems, "Retrieved saved items");
  //     setSavedItems(savedItems);
  //     // Update the UI with the saved items
  //   });
  // }
  function loadSavedItems(agentName: any) {
    console.log(agentName, "agentName");
    chrome.storage.local.get({ savedItems: [] }, (result) => {
      const savedItems: any = result.savedItems;

      // Filter items based on the provided agentName
      const filteredItems: any = savedItems.filter(
        (item: any) => item.agentName === agentName
      );

      console.log(filteredItems, "Retrieved saved items for agent:", agentName);
      
      setSavedItems(filteredItems);
     
      // Update the UI with the filtered items
    });
  }
  function loadSavedItemsAll() {
    chrome.storage.local.get({ savedItems: [] }, (result) => {
      const savedItems: any = result.savedItems;


      setSavedItemsAll(savedItems);
     
      // Update the UI with the filtered items
    });
  }

  // loadSavedItems(activeAgency?.name);

  





  // Listen for messages from background.js
  
  // function clearSavedItems(agentName:any) {
  //   chrome.storage.local.remove('savedItems', () => {
  //     if (chrome.runtime.lastError) {
  //       console.error('Error removing saved items:', chrome.runtime.lastError);
  //     } else {
  //       console.log('All saved items have been removed.');
  //       // Optionally, you might want to update the UI or handle any state changes here
  //       setSavedItems([]); // Assuming setSavedItems is used to update your UI with the current state
  //     }
  //   });
  // }

  function clearSavedItems(agentName: any) {
    chrome.storage.local.get({ savedItems: [] }, (result) => {
      const savedItems: any = result.savedItems;

      // Filter out items that match the provided agentName
      const remainingItems: any = savedItems.filter(
        (item: any) => item.agentName !== agentName
      );

      // Save the updated list back to storage
      chrome.storage.local.set({ savedItems: remainingItems }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error updating saved items:",
            chrome.runtime.lastError
          );
        } else {
          console.log("Items for agent:", agentName, "have been removed.");
          setSavedItems([]); // Update your UI with the current state
        }
      });
    });
  }


  function deleteItem(itemToDelete: any) {
    chrome.storage.local.get({ savedItems: [] }, (result) => {
      const savedItems = result.savedItems;

      // Filter out the item to delete
      const updatedItems = savedItems.filter((item: any) => item.value !== itemToDelete.value);

      // Check if the updated list is empty
      // if (updatedItems.length === 0) {
      //   setTimeout(() => {
      //     console.log("last Item deleted:", itemToDelete.value);
      //     setSavedItems([]); // Set to an empty array if no items left
      //   }, 500);
      // } else {
      //   console.log("Item deleted:mmmm", itemToDelete.value);
      //   setSavedItems(updatedItems); // Update UI with the updated list
      // }

      // Save the updated list back to storage
      chrome.storage.local.set({ savedItems: updatedItems }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error updating saved items:", chrome.runtime.lastError);
        } else {
          console.log("Item deleted:", itemToDelete.value);
          loadSavedItems(activeAgency?.name);
        }
      });
    });
  }
  
  const getPageData = () => {
    const turndownService = new TurndownService();
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs: any) {
        // Send a message to the content script to count h1 tagsc
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "bodyData" },
          function (response) {
            const markdownContent = turndownService.turndown(
              response.data.body
            );
            setMarkdown(markdownContent);
            setMarkdownData(markdownContent);
            console.log(
              "markdownContentmarkdownContentmarkdownContent",
              markdownContent
            );
          }
        );
      }
    );
  };

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    // const checkbox: any = document.getElementById("doIAddWebPageData");
    // const isChecked = checkbox.checked;
    handleResetImage()
    chrome.storage.local.set({ initialmessage: false }, () => {
      console.log("initial message save in datbase");
    });

    setInitalMessage(false)
    setMessages((prevMessages: any) => [
      ...prevMessages,
      { id: prevMessages.length + 1, type: "sender", text: input },
    ]);

    setInput("");

    const container = document.querySelector(".chat-container");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }

    const turndownService = new TurndownService();
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs: any) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "bodyData" },
          function (response) {
            const markdownContent = turndownService.turndown(
              response.data.body
            );

            if (input.trim() === "") return;
            setLoading(true);

            setTimeout(async () => {
              const apiUrl = chatUrl;
              const payload = {
                image: imageSrc,
                msg:  ` ${input}`,
                website: `${savedItems.map((item:any) => item.value).join(', ')}`,
              };
              try {
                const response = await axios.request({
                  url: apiUrl,
                  method: "post",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: payload,
                  timeout: 2 * 60 * 1000,
                });

                const parsedObj = marked(response?.data?.output);
                if (response) {
                  setMessages((prevMessages: any) => [
                    ...prevMessages,
                    {
                      id: prevMessages.length + 1,
                      type: "receiver",
                      text: parsedObj,
                    },
                  ]);
                  setLoading(false);
                }
              } catch (error) {
                if (axios.isCancel(error)) {
                  console.error("Request canceled:", error.message);
                } else {
                  console.error("Error:", error);
                }
                setLoading(false);
              }
            }, 2000);
          }
        );
      }
    );
  };

  const [agents, setAgents] = useState(
    JSON.parse(localStorage.getItem("agents") || "[]")
  );
  
  const [formData, setFormData]: any = useState({
    name: "",
    description: "",
    icon: "",
    webhookUrl: "",
    id: "",
  });



  // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //   if (message.type === "showError") {
  //     loadSavedItems(activeAgency?.name);
  //     console.log("showError received");
  //   } else if (message.type === "textSave") {
  //     loadSavedItems(activeAgency?.name);
  //     console.log("textSave received");
  //   } else if (message.type === "imageSave") {
  //     console.log("imageSave received");
  //     loadSavedItems(activeAgency?.name);
  //   }
  //    else if (message.type === "imageSave1") {
  //     console.log("imageSave received 123123123123");
  //     loadSavedItems(activeAgency?.name);
  //   }
  // });
  const handleCopy = (text: any) => {
    // Create a temporary DOM element to extract plain text
    const tempElement = document.createElement("div");
    tempElement.innerHTML = text;
    const plainText = tempElement.textContent || tempElement.innerText || "";

    navigator.clipboard
      .writeText(plainText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 5000); // Reset feedback after 5 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "icon" && files.length > 0) {
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = files[0].name.split(".").pop();
      if (allowedExtensions.includes(fileExtension.toLowerCase())) {
        setFileName(e.target.files[0].name);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          setFormData((prevFormData: any) => ({
            ...prevFormData,
            [name]: e.target.result,
          }));
        };
        reader.readAsDataURL(files[0]);
      } else {
        setFileName("Please Select the JPEG,JPG OR PNG file");
        const iconLabelInput = document.getElementById("iconLabel");
        if (iconLabelInput) {
          iconLabelInput.style.borderColor = "red";
        }
      }
    } else {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  useEffect(() => {
    // const handleMessage = (message: any) => {
    //   if (message.action === "messageSend") {
    //     // console.log("Message received in App.tsx:", message);
    //     // setTimeout(() => {
    //     //   loadSavedItemsAll();
    //     // }, 1000);
        
    //     updateSavedItem()
    //   }else{

      
    //     chrome.storage.local.get(["initialmessage"], (result) => {
    //       setInitalMessage(result.initialmessage === false ? false : true);
    //       console.log(result, "result");
    //       console.log(result.initialmessage, "result.initialmessage");
    //     });

    //     chrome.storage.local.get(["agents"], (result) => {
    //       const agentsFromChrome = result.agents || [];
    //       console.log("agents", result.agents);
    //       setTimeout(() => {
    //         console.log("agentsFromChrome", agentsFromChrome);
    //         if (Array.isArray(agentsFromChrome) && agentsFromChrome.length > 0) {
    //           setAgents(agentsFromChrome);
    //           setSection("home");
    //         }
    //       }, 1500);
    //     });
    //   }
    // };

    loadSavedItemsAll();
    chrome.storage.local.get(["initialmessage"], (result) => {
      setInitalMessage(result.initialmessage === false ? false : true);
      console.log(result, "result");
      console.log(result.initialmessage, "result.initialmessage");
    });

    chrome.storage.local.get(["agents"], (result) => {
      const agentsFromChrome = result.agents || [];

      if (Array.isArray(agentsFromChrome) && agentsFromChrome.length > 0) {
        setAgents(agentsFromChrome);
        setSection("home");
      }
    });

  
  }, []);

useEffect(() => {
  const handleMessage = (message: any) => {
    if (message.action === "messageSend") {
      // console.log("Message received in App.tsx:", message);
      setTimeout(() => {
        loadSavedItems(activeAgency?.name);
      }, 1000);
      
      // updateSavedItem()
      
    }else{

    
      chrome.storage.local.get(["initialmessage"], (result) => {
        setInitalMessage(result.initialmessage === false ? false : true);
        console.log(result, "result");
        console.log(result.initialmessage, "result.initialmessage");
      });

      chrome.storage.local.get(["agents"], (result) => {
        const agentsFromChrome = result.agents || [];
        console.log("agents", result.agents);
        setTimeout(() => {
          console.log("agentsFromChrome", agentsFromChrome);
          if (Array.isArray(agentsFromChrome) && agentsFromChrome.length > 0) {
            setAgents(agentsFromChrome);
            setSection("home");
          }
        }, 1500);
      });
    }
  };
  chrome.runtime.onMessage.addListener(handleMessage);

  return () => {
    chrome.runtime.onMessage.removeListener(handleMessage);
  };
}, [savedItems]);




function updateSavedItem() {
  
  console.log("updateSavedItem",activeAgency);
  if(!activeAgency?.name){
    loadSavedItems(openSavedItems)
    console.log("openSavedItems",openSavedItems);
  }else{
    loadSavedItems(activeAgency?.name);
    console.log("activeAgency",activeAgency);
  }
}
  // useEffect(()=>{


  //   setAgents([ {
  //     "description": "tlkhas kasdfh kasjdf asjkdfh askj faskf askjfh aksdjfh askdjf asjkdfh asjkfh asjkfh asjkdfh askjdfh asjkdfh asjkdfh askjfh asjkdfh asjkfh askjfh askjf asjkdfhas kjfh askjdfh ask ",
  //     "icon": "data:C",
  //     "id": "lcxbvbb72d",
  //     "name": "Yousaf",
  //     "webhookUrl": "https://make"
  // }]);
   
  // },[])

  const handleSaveAgent = () => {
    console.log("save");
    setFileName("Set Your Agent Icon");
    console.log(formData, "formData");

    const nameInput = document.getElementById("name") as HTMLInputElement;
    const descriptionInput = document.getElementById(
      "description"
    ) as HTMLInputElement;
    const webhookUrlInput = document.getElementById("url") as HTMLInputElement;

    if (
      formData.name &&
      formData.description &&
      formData.webhookUrl &&
      formData.webhookUrl.startsWith("https://") &&
      formData.webhookUrl.includes("make")
    ) {
      // Update state
      setAgents((prevAgents: any) => [...prevAgents, { ...formData }]);

      // Save to Chrome storage
      chrome.storage.local.get(["agents"], (result) => {
        const existingAgents = result.agents || [];
        const newAgent = Array.isArray(formData) ? formData : [formData];
        const updatedAgents = [...existingAgents, ...newAgent];

        chrome.storage.local.set({ agents: updatedAgents }, () => {
          console.log("Data stored in Chrome extension storage.");
        });
      });
      chrome.tabs.query(
        { active: true, currentWindow: true },
        function (tabs:any) {
          console.log("message sent from App.jsx");
          chrome.runtime.sendMessage(
            { action: "refreshContextMenu" }
          );
        }
      );
      
      console.log("hello");
      setSection("home");
    } else {
      if (!formData.name) {
        setValidationName(true);
        nameInput.style.borderColor = "red";
      } else {
        setValidationName(false);
        nameInput.style.borderColor = "transparent";
      }

      if (!formData.description) {
        setValidationDescription(true);
        descriptionInput.style.borderColor = "red";
      } else {
        setValidationDescription(false);
        descriptionInput.style.borderColor = "transparent";
      }

      const makeKeyword = "make";
      if (
        !formData.webhookUrl ||
        !formData.webhookUrl.startsWith("https://") ||
        !formData.webhookUrl.includes(makeKeyword)
      ) {
        setValidationUrl(true);
        webhookUrlInput.style.borderColor = "red";
      } else {
        setValidationUrl(false);
        webhookUrlInput.style.borderColor = "transparent";
      }
    }
  };

  const handleDeleteAgent = (id: any) => {
    console.log(id);

    // Filter out the agent to be deleted
    chrome.storage.local.get(["agents"], (result) => {
      const existingAgents = result.agents || [];
      const updatedAgents = existingAgents.filter(
        (agent: any) => agent.id !== id
      );

      // Update state
      setAgents(updatedAgents);

      // Save to Chrome storage
      chrome.storage.local.set({ agents: updatedAgents }, () => {
        setSection("home")
        console.log(
          "Agent deleted and data updated in Chrome extension storage."
        );
      });
    });
  };

  const handleEditAgent = (agent: any) => {
    // Update form data for editing
    setFormData({
      name: agent.name,
      description: agent.description,
      webhookUrl: agent.webhookUrl,
      id: agent.id,
      icon: agent.icon,
    });
    setUpdate(true);
    setSection("createAgent");

    // Retrieve existing agents from Chrome storage
    chrome.storage.local.get(["agents"], (result) => {
      const existingAgents = result.agents || [];
      // Find index of the agent to be updated
      const index = existingAgents.findIndex((a: any) => a.id === agent.id);

      if (index !== -1) {
        // Update the agent details
        existingAgents[index] = { ...agent };

        // Save updated agents to Chrome storage
        chrome.storage.local.set({ agents: existingAgents }, () => {
          console.log("Agent updated in Chrome extension storage.");
        });
      }
    });

    // Retrieve existing agents from localStorage
    const storedAgents = JSON.parse(localStorage.getItem("agents") || "[]");
    // Find index of the agent to be updated
    const localIndex = storedAgents.findIndex((a: any) => a.id === agent.id);

    if (localIndex !== -1) {
      // Update the agent details
      storedAgents[localIndex] = { ...agent };

      // Save updated agents to localStorage
      localStorage.setItem("agents", JSON.stringify(storedAgents));
      console.log("Agent updated in localStorage.");
    }
  };

  const truncateText = (text: any, maxLength: any) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const handleUpdate = () => {
    console.log("update");
    console.log(formData, "formData");
    console.log(agents, "agents");
    const agentIndex = agents.findIndex(
      (agent: any) => agent.id === formData.id
    );
    console.log(agentIndex, "agentIndex");
    if (agentIndex !== -1) {
      const updatedAgents = [...agents];
      updatedAgents[agentIndex] = {
        ...updatedAgents[agentIndex],
        name: formData.name,
        description: formData.description,
        webhookUrl: formData.webhookUrl,
        icon: formData.icon,
      };
      console.log(updatedAgents, "updatedAgents");
      setAgents(updatedAgents);
      localStorage.setItem("agents", JSON.stringify(updatedAgents));
      setSection("home");
    }
    setUpdate(false);
    setFormData({
      name: "",
      description: "",
      icon: "",
      webhookUrl: "",
      id: "",
    });
    setFileName("Set Your Agent Icon");
    setActiveAgent({})
  };

  let content;
  if (section === "home") {
    content = (
      <>
        <Header/>
        <div className="container-fluid">
          <div className="home d-flex flex-column" style={{ paddingTop:"50px" }}>
            <div className="row d-flex justify-content-center align-items-center mx-4 my-2">
              <div className="p-0 menu d-flex justify-content-between w-100 flex-row align-items-center">
              <h2
                  style={{ fontWeight: "700", fontSize: "20px", margin: "0" }}
                >
                  Your Agents
                </h2>
                <div className="icons">
                <div
                  className="btn btn-white d-none"
                 
                >
                  {/* <FaPen size={15} /> */}
                </div>
                <div
                  className="btn btn-white p-0"
                  onClick={() => {
                    setSection("createAgent");
                    setValidationName(true);
                    setValidationDescription(true);
                    setValidationUrl(false);
                    setFormData({
                      name: "",
                      description: "",
                      icon: "",
                      webhookUrl: "",
                      id: Math.random().toString(36).substring(2),
                    });
                  }}
                >
                  <div style={{ fontSize: "35px",lineHeight:"35px" }}>+</div>
                </div>
                </div>
              </div>
      
              {/* <div className="col-7 text-start">
                <h2
                  style={{ fontWeight: "800", fontSize: "24px", margin: "0" }}
                >
                  Your Agents
                </h2>
              </div>
              <div className="col text-end">
              
                <div
                  className="btn btn-white"
                 
                >
                  <FaPen size={15} />
                </div>
                <div
                  className="btn btn-white p-0"
                  onClick={() => {
                    setSection("createAgent");
                    setValidationName(true);
                    setValidationDescription(true);
                    setValidationUrl(false);
                    setFormData({
                      name: "",
                      description: "",
                      icon: "",
                      webhookUrl: "",
                      id: Math.random().toString(36).substring(2),
                    });
                  }}
                >
                  <div style={{ fontSize: "35px" }}>+</div>
                </div>
              </div> */}
            </div>
            <div className="row">
              {agents.map((agent: any) => {
                return (
                  <Card
                  savedItemsAll={savedItemsAll}
                    name={agent.name}
                    image={agent.icon}
                    id={agent.id}
                    description={agent.description}
                    setSection={setSection}
                    url={agent.webhookUrl}
                    setChatUrl={setChatUrl}
                    setMessages={setMessages}
                    setActiveAgent={setActiveAgent}
                    agent={agent}
                    handleEditAgent={handleEditAgent}
                    section="chat"
                    handleDeleteAgent={handleDeleteAgent}
                    loadSavedItems={loadSavedItems}
                    
                  />
                );
              })}
            </div>
            {/* <div className=" container-fluid row position-fixed bottom-0 d-flex justify-content-center w-100 p-2">
              <button
                className="main-btn m-2 btn btn-primary"
                onClick={() => {
                  setSection("createAgent");
                  setFormData({
                    name: "",
                    description: "",
                    icon: "",
                    webhookUrl: "",
                    id: Math.random().toString(36).substring(2),
                  });
                  setValidationName(true);
                  setValidationDescription(true);
                  setValidationUrl(false);
                }}
                style={{
                  fontWeight: "700",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                Create Agent
              </button>
            </div> */}
          </div>
        </div>
      </>
    );
  } else if (section === "createAgent") {
    content = (
      <>
        <div className="container-fluid p-0">
        <Header/>
          <div className="home d-flex flex-column " style={{ height: "100vh",paddingTop:"50px" }}>
            {/* <div className="row d-flex justify-content-center align-items-center">
              <div className="col" style={{ fontSize: "35px" }}>
                <span
                  style={{ width: "50px", cursor: "pointer", fontSize: "35px" }}
                  onClick={() => {
                    setSection("home");
                    setValidationName(false);
                    setValidationDescription(false);
                    setValidationUrl(false);
                    setFileName("Set Your Agent Icon");
                  }}
                >
                  <MdOutlineArrowBack size={25} />
                </span>
              </div>
              <div className="col-8 text-center" style={{ marginTop: "13px" }}>
                <h2
                  style={{ fontWeight: "700", fontSize: "18px" }}
                  className="fw-bold"
                >
                  Setup Your Agent{" "}
                </h2>
              </div>
              <div className="col">
                <div
                  className="btn btn-white"
                  onClick={() => setSection("createAgent")}
                ></div>
              </div>
            </div> */}

            <div className="row m-4">
              <div className="UpdateHeader d-flex justify-content-between align-items-center">
              <h1 style={{fontWeight:700,fontSize:"20px"}}>{update?"Update Agent" :"Agent Setup"}</h1>
                {update && (
                // <button
                //   className="main-btn m-2 btn btn-danger"
                //   onClick={() => handleDeleteAgent(formData.id)}
                //   style={{
                //   fontWeight: "700",
                //   fontSize: "14px",
                //   lineHeight: "24px",
                //   width: "40%",
                //   }}
                // >
                // </button>
                <MdDelete 
                size={20}
                className="delete-icon"
                onClick={() => handleDeleteAgent(formData.id)}
                style={{
                  cursor: 'pointer',
                  marginLeft: '10px',
                  color: 'red',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#5D2AC6"')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#5D2AC6"')}
              />
                )}
              </div>
             
              <div className="form">
                <form>
                  <div className="form-group mt-1">
                    <label htmlFor="name">
                      Agent Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Mark the Poster"
                      value={formData.name}
                      name="name"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>

                  <div className="form-group mt-3">
                    <label htmlFor="description">
                      Description{" "}
                      <span className="text-danger">
                        {" "}
                        {validationDescription ? "*" : " "}
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      placeholder="Create the best Instagram post"
                      value={formData.description}
                      name="description"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="icon">Agent Icon</label>
                    <label
                      htmlFor="icon"
                      id="iconLabel"
                      className="form-control"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>{fileName}</div>
                        <div>
                          <img src={exportIcon} alt="" />
                        </div>
                      </div>
                    </label>
                    <input
                      type="file"
                      className="form-control d-none"
                      id="icon"
                      placeholder="Agent Name"
                      name="icon"
                      accept=".jpg, .jpeg, .png"
                      onChange={(e: any) => {
                        handleChange(e);
                      }}
                    />
                  </div>

                  <div className="form-group mt-3">
                    <label htmlFor="url">
                      Webhook Url <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="url"
                      placeholder="https://hook.us1.make.com/make1zap0....."
                      name="webhookUrl"
                      value={formData.webhookUrl}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  {validationUrl ? (
                    <>
                      <small className="text-danger small ">
                        URL must be a valid Make webhook
                      </small>
                    </>
                  ) : null}
                </form>
              </div>
            </div>
            <div className=" row position-absolute bottom-0 p-2 d-flex justify-content-center align-items-center flex-row text-center w-100">
              <div className="col d-flex justify-content-center">
              <button
                className="main-btn m-2 btn btn-outline-dark"
                onClick={() => {
                  setSection(update ? "chat" : "home");
                  setValidationName(false);
                  setValidationDescription(false);
                  setValidationUrl(false);
                  setFileName("Set Your Agent Icon");
                  setUpdate(false)
                }}
                style={{
                  fontWeight: "700",
                  fontSize: "14px",
                  lineHeight: "24px",
                  width:"40%"
                }}
              >
                Close
              </button>
              <button
                className="main-btn m-2 btn btn-primary"
                onClick={update ? handleUpdate : handleSaveAgent}
                style={{
                  fontWeight: "700",
                  fontSize: "14px",
                  lineHeight: "24px",
                  width:"40%"

                }}
              >
                Save Agent
              </button>
              </div>
            </div>


          </div>
        </div>
      </>
    );
  } else if (section === "notes") {
    content = (
      <>
        <div className="container-fluid">
          <div className="home d-flex flex-column" style={{ height: "100vh" }}>
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col" style={{ fontSize: "35px" }}>
                <span
                  style={{ width: "50px", cursor: "pointer", fontSize: "35px" }}
                  onClick={() => {
                    setSection("home");
                    setValidationName(false);
                    setValidationDescription(false);
                    setValidationUrl(false);
                    setFileName("Set Your Agent Icon");
                  }}
                >
                  <MdOutlineArrowBack size={25} />
                </span>
              </div>
              <div className="col-8 text-center" style={{ marginTop: "13px" }}>
                <h2
                  style={{ fontWeight: "700", fontSize: "18px" }}
                  className="fw-bold"
                >
                  Notes
                </h2>
              </div>
              <div className="col">
                <div
                  className="btn btn-white"
                  onClick={() => setSection("createAgent")}
                ></div>
              </div>
            </div>
            {/* <div className="btn btn-danger" onClick={clearSavedItems}> Delete Save Messages of this agent</div> */}
            <ol>
              {savedItems.map((item: any, index: any) => {
                return <li key={index}>{item.value}</li>;
              })}
            </ol>
          </div>
        </div>
      </>
    );
  } else if (section === "chat") {
    content = (
      <>
      {isModalOpen && (
        <>
      <div
  className="overlay"
  onClick={closeModal}
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for better focus
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  }}
></div>
<div
  className="modal-container"
  style={{
    position: 'fixed',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    width: '80%',
    maxWidth: '600px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    zIndex: 10000,
  }}
>
  <div className="modal-content">
    <span
      className="close-btn"
      onClick={closeModal}
      style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        cursor: 'pointer',
        color: '#5D2AC6"',
      }}
      onMouseOver={(e) => (e.currentTarget.style.color = '#000')}
      onMouseOut={(e) => (e.currentTarget.style.color = '#5D2AC6"')}
    >
      <MdClose size={25} />
    </span>
    <h2
      style={{
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '24px',
        color: '#333',
      }}
    >
      Saved Messages
    </h2>
    <ol
      className="saved-items-list"
      style={{ paddingLeft: '0', listStyleType: 'none' }}
    >
      {savedItems.map((item: any, index: any) => (
        <li
          key={index}
          className="saved-item"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            padding: '10px 15px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
        >
          {item.type === 'image' ? (
            <img
              src={item.value}
              alt="Saved Item"
              style={{
                maxWidth: '100px',
                maxHeight: '100px',
                borderRadius: '8px',
                marginRight: '10px',
              }}
            />
          ) : (
            <span
              className="item-text"
              style={{ cursor: 'pointer', flex: 1, color: '#555' }}
              onClick={() => handleItemClick(item.value)}
            >
              {truncateText(item.value, 18)}
            </span>
          )}
          

          <AiFillMinusCircle
            size={18}
            className="delete-icon"
            onClick={() => deleteItem(item)}
            style={{
              cursor: 'pointer',
              marginLeft: '10px',
              color: 'red',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#5D2AC6"')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#5D2AC6"')}
          />
        </li>
      ))}
    </ol>
    <div
      className="btn btn-primary"
      onClick={() => clearSavedItems(activeAgency?.name)}
      style={{
        display: 'block',
        margin: '30px auto 0',
        padding: '12px 25px',
        fontWeight: 'bold',
        
        color: '#fff',
        textAlign: 'center',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#5D2AC6"')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5D2AC6"')}
    >
      Delete Saved Items of This Agent
    </div>
  </div>
</div>

        </>
      )}
      <div
        className="container-fluid"
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Header />
        <div className="d-flex flex-column" style={{ height: '100vh' }}>
          <div className="row d-flex justify-content-center align-items-center fixed-top" style={{background:"white",marginTop:"50px"}}>
            <div
              className="col"
              style={{
                fontSize: '35px',
                paddingRight: 0,
                paddingLeft: '20px',
              }}
            >
              <span
                style={{ width: '50px', cursor: 'pointer', fontSize: '35px' }}
                onClick={() => {
                  setSection('home');
                  setImageSrc('');
                }}
              >
                {/* <MdOutlineArrowBack size={25} /> */}
                <IoIosArrowBack  size={25}/>

              </span>
            </div>
            <div className="col-6 text-center text-truncate">
              <h2
                style={{
                  fontWeight: '700',
                  fontSize: '18px',
                  marginTop: '11px',
                }}
                className="fw-bold"
              >
                {truncateText(activeAgency?.name, 18)}
              </h2>
            </div>
            <div className="col text-end">
              <div
                className="btn btn-white p-0"
                onClick={() => {
                  handleEditAgent(activeAgency)
                  // openModal();
                  // loadSavedItems(activeAgency?.name);
                }}
              >
                <div>
                <FaPen size={15} />
                  
                </div>
              </div>
              <div
                className="btn btn-white "
                onClick={() => {
                  openModal();
                  loadSavedItems(activeAgency?.name);
                  setTimeout(() => {
                    setOpenSavedItems(activeAgency?.name)  
                  }, 2000);
                  
                  console.log(activeAgency,"saved items")
                }}
              >
                <div>
                
                  <CgFileDocument size={25} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="chat">
              {/* Determine which messages to display */}
              {(() => {
                const defaultMessages = [
                  {
                    id: 'default1',
                    type: 'receiver1',
                    text: ` <p>Hello user :) Let's create the best content for your Instagram together ✨</p>

    <h3>To get started:</h3>
    <ol>
        <li>Go on a page that interests you.</li>
        <li>Select the text that you would like to use as a context for your Instagram post.</li>
        <li>Right-click, in the appeared drop-down choose "<strong>Send to agent</strong>" button.</li>
       
    </ol>`,
                  },
                  {
                    id: 'default2',
                    type: 'receiver2',
                    text: '<p>Thanks, I have the info! Now, tell me what do you want your post to be like!</p>',
                  },
                ];
                const displayedMessages =
                  messages.length === 0 ? initalMessage ?defaultMessages: messages: messages;
                return (
                  <div className="chat-container" style={{padding:"9rem 0px 7rem 0px",position:"relative",minHeight:"100vh"}}>
                    {displayedMessages.map((message:any) => (
                      <div key={message.id} className={message.type}>
                        {message.type !== 'sender' && activeAgency?.icon && (
                          <img
                            src={activeAgency.icon}
                            alt=""
                            style={{
                              borderRadius: '100px',
                              height: '40px',
                              width: '40px',
                              objectFit: 'cover',
                            }}
                            className="mt-2 me-2"
                          />
                        )}
                        <div className="message" style={{ position: 'relative' }}>
                          <div
                            dangerouslySetInnerHTML={{ __html: message.text }}
                          ></div>
                          {message.type === 'receiver' && (
                            <div
                              className="copy-button"
                              style={{
                                cursor: 'pointer',
                                position: 'absolute',
                                right: '-30px',
                                bottom: '10px',
                              }}
                              onClick={() => handleCopy(message.text)}
                            >
                              {copied ? (
                                <LuCopyCheck size={20} />
                              ) : (
                                <IoCopyOutline size={20} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="receiver">
                        {activeAgency?.icon && (
                          <img
                            src={activeAgency.icon}
                            alt=""
                            style={{
                              borderRadius: '100px',
                              height: '40px',
                              width: '40px',
                              objectFit: 'cover',
                            }}
                            className="mt-2 me-2"
                          />
                        )}
                        <div className="message">
                          <div className="dots-container">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="row fixed-bottom bottom-0 d-flex justify-content-center w-100 pb-2 px-2 m-0" style={{background:"white"}}>
          <div className="form-check d-block ms-1 p-0 position-relative">
            <div className="position-relative">
              {imageSrc && (
                <img
                  src={imageSrc}
                  width="50px"
                  height="50px"
                  alt=""
                  style={{ display: 'block', borderRadius: '1rem' }}
                />
              )}
              {imageSrc && (
                <div
                  className="position-absolute top-0 "
                  style={{ left: '38px', cursor: 'pointer' }}
                  onClick={handleResetImage}
                >
                  <IoIosCloseCircle size={18} />
                </div>
              )}
            </div>
            
          </div>
          <div className="input-container m-1 p-1 relative rounded">
            <label
              htmlFor="file-upload"
              className=" pin-button ms-1"
              style={{ cursor: 'pointer' }}
            >
              {/* <MdOutlineAttachFile size={20} /> */}
              <ImAttachment  size={20}/>

            </label>
            <input
              type="text"
              className="chat-input"
              placeholder="Tell Make Agent anything..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSend();
                  
                }
              }}
            />

            <button className="send-button" onClick={handleSend}>
              <LuSendHorizonal size={20} />
            </button>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {isOverlayVisible && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '10px',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              Drag here
            </div>
          </div>
        )}
      </div>
    </>
    );
  } else if (section === "startChat") {
    content = (
      <>
        <div className="container-fluid">
          <Header/>
          <div className="py-3 d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
        
            <div className="container-fluid row position-fixed d-flex justify-content-center w-100 p-5">
              <button
                className="main-btn p-2 btn btn-primary"
                onClick={() => {
                  setSection("home");
                }}
                style={{
                  fontWeight: "700",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
         Start setting up your agents ✨ 
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="App">
      <div>{content}</div>
    </div>
  );
}

export default App;
