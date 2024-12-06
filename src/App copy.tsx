import "./App.css";

import React, { useEffect, useState } from "react";
import Card from "./components/Card";
import image1 from "./assets/image1.jpg";
import Form from "./components/Form";
import { MdOutlineArrowBack, MdOutlineAttachFile } from "react-icons/md";
import { LuSend, LuSendHorizonal } from "react-icons/lu";
import waving from "./assets/waving.png";
import makeLogo from "./assets/make-logo.png";
import avatar from "./assets/b.webp";
import exportIcon from "./assets/exportIcon.png";
import TurndownService from "turndown";
import axios from "axios";
import { marked } from "marked";
import { FaPen } from "react-icons/fa";

function App() {
  const [validationName, setValidationName] = useState(true);
  const [validationDescription, setValidationDescription] = useState(true);
  const [validationUrl, setValidationUrl] = useState(false);
  const [markdown, setMarkdown]: any = useState("");
  const [markdownData, setMarkdownData]: any = useState("");
  const [fileName, setFileName]: any = useState("Set Your Agent Icon");
  const [chatUrl, setChatUrl]: any = useState("");
  const [loading, setLoading]: boolean | any = useState(false);
  const [section, setSection] = useState("startChat");
  const [update, setUpdate]: any = useState(false);
  const [messages, setMessages]: any = useState();
  const [input, setInput] = useState("");
  const [savedItems, setSavedItems]: any = useState([]);
  const [imageSrc, setImageSrc]:any = useState('');

  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result); // Set image source to the uploaded image
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  function loadSavedItems() {
    chrome.storage.local.get({ savedItems: [] }, (result) => {
      const savedItems = result.savedItems;
      console.log(savedItems, "Retrieved saved items");
      setSavedItems(savedItems);
      // Update the UI with the saved items
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
    const checkbox: any = document.getElementById("doIAddWebPageData");
    const isChecked = checkbox.checked;

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
                msg: input,
                website: isChecked ? markdownContent : "",
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
  const [activeAgency, setActiveAgent] = useState<any>({});
  const [formData, setFormData]: any = useState({
    name: "",
    description: "",
    icon: "",
    webhookUrl: "",
    id: "",
  });

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
  // useEffect(() => {
  //   // Retrieve agents from Chrome storage
  //   chrome.storage.local.get(['agents'], (result) => {
  //     const agentsFromChrome = result.agents || [];

  //     // Update state with agents
  //     if (Array.isArray(agentsFromChrome) && agentsFromChrome.length > 0) {
  //       setAgents(agentsFromChrome);
  //       setSection('home');

  //       // Send agents to content script
  //       setTimeout(() => {
  //         chrome.tabs.query(
  //           { active: true, currentWindow: true },
  //           (tabs:any) => {
  //             chrome.tabs.sendMessage(
  //               tabs[0].id,
  //               { action: "updateAgents", agents: agentsFromChrome }
  //             );
  //           }
  //         );
  //       }, 2000);
  //     }
  //   });
  // }, []);

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
  };

  let content;
  if (section === "home") {
    content = (
      <>
        <div className="container-fluid">
          <div className="home d-flex flex-column" style={{ height: "100vh" }}>
            <div className="row d-flex justify-content-center align-items-center my-2">
              <div className="col" style={{ fontSize: "35px" }}>
                <div
                  className="btn btn-white"
                  onClick={() => {
                    setSection("notes");
                    loadSavedItems();
                  }}
                >
                  <div style={{ fontSize: "35px", marginTop: "-8px" }}>
                    {" "}
                    <FaPen size={15} />{" "}
                  </div>
                </div>
              </div>
              <div className="col-6 text-center">
                <h2
                  style={{ fontWeight: "700", fontSize: "18px", margin: "0" }}
                >
                  Your Agents
                </h2>
              </div>
              <div className="col text-end">
                <div
                  className="btn btn-white"
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
                  <div style={{ fontSize: "35px", marginTop: "-8px" }}>+</div>
                </div>
              </div>
            </div>
            <div className="row">
              {agents.map((agent: any) => {
                return (
                  <Card
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
                  />
                );
              })}
            </div>
            <div className=" container-fluid row position-fixed bottom-0 d-flex justify-content-center w-100 p-2">
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
            </div>
          </div>
        </div>
      </>
    );
  } else if (section === "createAgent") {
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
                    setFileName("set Your Agent Icon");
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
            </div>
            <div className="row">
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
                      <div className="d-flex justify-content-between">
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
            <div className="container-fluid row position-absolute bottom-0 d-flex justify-content-center w-100 p-2">
              <button
                className="main-btn m-2 btn btn-primary"
                onClick={update ? handleUpdate : handleSaveAgent}
                style={{
                  fontWeight: "700",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                Save Agent
              </button>
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
                    setFileName("set Your Agent Icon");
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
        <div className="container-fluid">
          <div className="d-flex flex-column" style={{ height: "100vh" }}>
            <div
              className="row d-flex justify-content-center align-items-center fixed-top"
              style={{ backgroundColor: "#F2E8F2" }}
            >
              <div
                className="col"
                style={{
                  fontSize: "35px",
                  paddingRight: 0,
                  paddingLeft: "20px",
                }}
              >
                <span
                  style={{ width: "50px", cursor: "pointer", fontSize: "35px" }}
                  onClick={() => setSection("home")}
                >
                  <MdOutlineArrowBack size={25} />
                </span>
              </div>
              <div className="col-8 text-center text-truncate">
                <h2
                  style={{
                    fontWeight: "700",
                    fontSize: "18px",
                    marginTop: "11px",
                  }}
                  className="fw-bold"
                >
                  {truncateText(activeAgency?.name, 18)}
                </h2>
              </div>
              <div className="col"></div>
            </div>
            <div className="row">
              <div className="chat ">
                <div className="chat-container py-5 my-5">
                  {messages.map((message: any) => (
                    <div key={message.id} className={message.type}>
                      {message?.type !== "sender" ? (
                        activeAgency?.icon ? (
                          <img
                            src={activeAgency?.icon}
                            alt=""
                            style={{
                              borderRadius: "100px",
                              height: "40px",
                              width: "40px",
                              objectFit: "cover",
                            }}
                            className="mt2 me-2"
                          />
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                      <div
                        className="message"
                        dangerouslySetInnerHTML={{ __html: message.text }}
                      ></div>
                    </div>
                  ))}
                  {loading && (
                    <div className={"receiver"}>
                      {activeAgency?.icon ? (
                        <img
                          src={activeAgency?.icon}
                          alt=""
                          style={{
                            borderRadius: "100px",
                            height: "40px",
                            width: "40px",
                            objectFit: "cover",
                          }}
                          className="mt2 me-2"
                        />
                      ) : (
                        ""
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
              </div>
              {/* old */}
              {/* <div
                className="row fixed-bottom bottom-0 d-flex justify-content-center w-100 py-3 px-2 m-0"
                style={{ backgroundColor: "#F2E8F2" }}
              >
                <div className="form-check ms-1">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="doIAddWebPageData"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="doIAddWebPageData"
                  >
                    Include Webpage Data
                  </label>
                  <img src={image1} width="50px" height="50px" alt="" style={{display:"block",borderRadius:"1rem"}} />
                </div>
                <div className="input-container m-0 p-0 relative">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSend();
                      }
                    }}
                  />
                  <label htmlFor="file-upload" className="pin-button">
                    <MdOutlineAttachFile size={20} />
                  </label>
                  <button className="send-button" onClick={handleSend}>
                    <LuSendHorizonal size={20} />
                  </button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    // onChange={handleFileChange}
                  />
                </div>
              </div> */}
{/* new */}
<div
      className="row fixed-bottom bottom-0 d-flex justify-content-center w-100 py-3 px-2 m-0"
      style={{ backgroundColor: "#F2E8F2" }}
    >
      <div className="form-check ms-1">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="doIAddWebPageData"
        />
        <label className="form-check-label" htmlFor="doIAddWebPageData">
          Include Webpage Data
        </label>
        <img
          src={imageSrc || image1} // Use uploaded image if available
          width="50px"
          height="50px"
          alt=""
          style={{ display: "block", borderRadius: "1rem" }}
        />
      </div>
      <div className="input-container m-0 p-0 relative">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSend();
            }
          }}
        />
        <label htmlFor="file-upload" className="pin-button">
          <MdOutlineAttachFile size={20} />
        </label>
        <button className="send-button" onClick={handleSend}>
          <LuSendHorizonal size={20} />
        </button>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange} // Handle file input change
        />
      </div>
    </div>
              {/* <button className="main-btn m-2 btn btn-primary">
                Save Agent
              </button> */}
            </div>
          </div>
        </div>
      </>
    );
  } else if (section === "startChat") {
    content = (
      <>
        <div className="container-fluid">
          <div className="py-3 d-flex flex-column" style={{ height: "100vh" }}>
            <div className="row">
              <h1
                style={{ fontWeight: "700", fontSize: "18px" }}
                className="text-center"
              >
                Welcome
              </h1>
            </div>
            <div className="row d-flex justify-content-center mt-5">
              <img
                src={makeLogo}
                style={{ width: "200px", height: "100%" }}
                alt="sdfasdf"
              />
            </div>
            <div className="row mt-5">
              <h3
                className="text-center mt-5 pt-5"
                style={{
                  fontWeight: "700",
                  fontSize: "18px",
                }}
              >
                Start Setting up your Agent
              </h3>
            </div>
            <div className="container-fluid row position-fixed bottom-0 d-flex justify-content-center w-100 p-2">
              <button
                className="main-btn m-2 btn btn-primary"
                onClick={() => {
                  setSection("home");
                }}
                style={{
                  fontWeight: "700",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                Let's Go
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
