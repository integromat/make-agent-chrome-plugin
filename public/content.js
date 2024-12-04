// Listen for messages from the extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "bodyData") {
    const body = document.querySelector("body").innerHTML;
    console.log("adfafasfsfas", body);
    const data = {
      body,
    };
    sendResponse({
      data,
    });
  }
});

let agents;
let webookUrl;
let textAreaId;
chrome.storage.local.get(["agents"], (result) => {
  agents = result.agents || [];
  webookUrl = agents[0]?.webhookUrl;
  // Example: Process and display the agents data
  if (agents.length > 0) {
    agents.forEach((agent) => {
      console.log(agent, "agent from backend");
    });
  } else {
    console.log("No agents found.");
  }
});

function showToast(message, duration = 3000) {
  // Create a toast element
  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.textContent = message;

  // Apply styles directly via JavaScript
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.backgroundColor = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "15px";
  toast.style.borderRadius = "5px";
  toast.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
  toast.style.opacity = "1";
  toast.style.transition = "opacity 0.5s ease";
  toast.style.zIndex = "9999";

  // Append the toast to the body
  document.body.appendChild(toast);

  // Remove the toast after the specified duration
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500); // Match the fade-out duration
  }, duration);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "showError") {
    showToast("No text or image selected. Please select some content to save.");
    chrome.runtime.sendMessage({ type: "imageSave1" });
  } else if (message.type === "textSave") {
    showToast("Text saved successfully.");
    chrome.runtime.sendMessage({ type: "imageSave1" });
  } else if (message.type === "imageSave") {
    showToast("Image saved successfully.");
    chrome.runtime.sendMessage({ type: "imageSave1" });
  }
});

// On Pressing Key show Drop Down Function

let isDropdownVisible = false;

// Function to handle dropdown option changes
function handleOptionChange(event) {
  const selectedValue = event.target.value;

  // Call a function with the selected value as parameter
  if (selectedValue) {
    performAction(selectedValue);
  }
}

async function performAction(value) {
  // Get the textarea element
  const textArea = document.getElementById(textAreaId);

  // Set "Loading..." in the textarea
  textArea.value = "Loading...";

  console.log("Selected value:", value);
  console.log(webookUrl, "webhook url inside the function");
  console.log(textAreaId, "textAreaId");

  const payload = {
    msg: value, // Make sure `input` is defined in the function scope or passed as a parameter
    website: "",
  };

  try {
    // Make the POST request using fetch
    const response = await fetch(webookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check if the response is successful
    if (response.ok) {
      // Parse the response JSON
      const data = await response.json();

      // Log or use the parsed object as needed
      console.log(data?.output, "Asdfaskljdfh");
      textArea.value = data?.output;
    } else {
      console.error("Response error:", response.statusText);
      textArea.value = "Error: " + response.statusText;
    }
  } catch (error) {
    console.error("Error:", error);
    textArea.value = "Error: " + error.message;
  }

  // Optionally, you can clear the loading text if needed
}

function createDropdown() {
  // Remove any existing dropdown
  const existingDropdown = document.querySelector(".dropdown");
  if (existingDropdown) {
    existingDropdown.remove();
  }

  // Create and style the dropdown container
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";
  dropdown.style.position = "fixed"; // Use fixed positioning
  dropdown.style.top = "10px"; // Adjust as needed
  dropdown.style.right = "10px"; // Adjust as needed
  dropdown.style.padding = "10px";
  dropdown.style.border = "1px solid #ccc";
  dropdown.style.borderRadius = "8px"; // Rounded corners
  dropdown.style.backgroundColor = "#fff";
  dropdown.style.zIndex = "1000";
  dropdown.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; // Subtle shadow

  // Create and style the select element
  const select = document.createElement("select");
  select.style.width = "150px"; // Set a fixed width
  select.style.padding = "8px 12px";
  select.style.border = "1px solid #ddd";
  select.style.borderRadius = "4px"; // Rounded corners
  select.style.backgroundColor = "#f9f9f9"; // Light background color
  select.style.fontSize = "14px";
  select.style.fontFamily = "Arial, sans-serif";
  select.style.color = "#333"; // Text color
  select.style.outline = "none"; // Remove default outline
  select.style.cursor = "pointer"; // Pointer cursor on hover

  // Create and append the placeholder option
  const placeholderOption = document.createElement("option");
  placeholderOption.value = ""; // No value for the placeholder
  placeholderOption.textContent = "Select";
  placeholderOption.disabled = true; // Make it unselectable
  placeholderOption.selected = true; // Make it the default selected
  placeholderOption.style.color = "#888"; // Placeholder text color
  placeholderOption.style.fontStyle = "italic"; // Italicize placeholder text
  select.appendChild(placeholderOption);

  // Create and append the other options
  const options = ["Option 1", "Option 2", "Option 3"];
  options.forEach((optionText) => {
    const option = document.createElement("option");
    option.value = optionText;
    option.textContent = optionText;
    option.style.backgroundColor = "#fff"; // Option background
    option.style.color = "#333"; // Option text color
    select.appendChild(option);
  });

  // Add event listener for option changes
  select.addEventListener("change", handleOptionChange);

  dropdown.appendChild(select);

  // Append the dropdown to the body
  document.body.appendChild(dropdown);
}

// Function to handle the visibility of the dropdown
function handleDropdown() {
  // Select the textarea element
  const textArea = document.querySelector("textarea");

  if (textArea) {
    // Check if the textarea is currently focused
    const isFocused = document.activeElement === textArea;

    // Remove any existing dropdown
    const existingDropdown = document.querySelector(".dropdown");
    if (existingDropdown) {
      existingDropdown.remove();
      isDropdownVisible = false;
    }

    if (isFocused && !isDropdownVisible) {
      // Create and show the dropdown
      textAreaId = textArea.id;
      createDropdown();
      isDropdownVisible = true;
    }
  }
}

// Event listener for keyboard shortcuts
document.addEventListener("keydown", function (event) {
  // Check if Ctrl, Shift, and K keys are pressed
  if (event.ctrlKey && event.shiftKey && event.key === "K") {
    // Prevent the default action for this shortcut (optional)
    event.preventDefault();
    // Toggle the dropdown visibility
    handleDropdown();
  }
});

// FLoating Button
// content.js
let selectedText = "";
document.addEventListener("selectionchange", () => {
  setTimeout(() => {
    const selection = window.getSelection().toString().trim();
    console.log("dfddfdf", selection);
    if (selection) {
      selectedText = selection;
    } else {
      selectedText = ""; // Reset if no text is selected
    }
  }, 1000);
});

// Retrieve agents from storage
chrome.storage.local.get(["agents"], (result) => {
  const agents = result.agents || [];
  if (agents.length > 0) {
    // Create the floating button
    createFloatingButton(agents);
  } else {
    console.log("No agents found.");
  }
});

let isDragging = false;
let offsetX, offsetY;

function createFloatingButton(agents) {
  // Create the button element
  const button = document.createElement("div");
  button.id = "floating-button";
  const iconImage = document.createElement("img");
  iconImage.src = chrome.runtime.getURL("icons/128.png"); // Use chrome.runtime.getURL to get the correct path
  iconImage.style.width = "100%";
  iconImage.style.height = "100%";
  iconImage.style.borderRadius = "3px"; // Ensure the image is circular
  button.appendChild(iconImage);

  // button.innerHTML = "&#9993;"; // Envelope icon

  // Style the button
  button.style = `position: fixed; padding:0; margin:0; bottom: 20px; left: 20px; width: 45px; height: 45px;
                  background-color: #5D2AC6; color: #fff; text-align: center; line-height: 55px;
                  border-radius: 3px; cursor: pointer; z-index: 10000; font-family: Arial, sans-serif;
                  font-size: 24px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: background-color 0.3s, transform 0.3s;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);  `;

  // Hover effect for the button
  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "#4A1F9E"; // Darker shade for hover effect
    button.style.transform = "scale(1.05)";
    agentsList.style.display = "block";
  });

  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "#5D2AC6";
    button.style.transform = "scale(1)";
    agentsList.style.display = "none";
  });

  // Create the agents list container
  const agentsList = document.createElement("div");
  agentsList.id = "agents-list";

  // Style the agents list
  agentsList.style = `position: absolute; padding:0;margin:0; bottom: 45px; left: 0px; display: none; z-index: 9999;
                      font-family: 'Arial', sans-serif; background-color: transparent;
                      flex-direction: column; align-items: center;`;

  // Populate the agents list
  agents.forEach((agent) => {
    const agentItem = document.createElement("div");
    agentItem.textContent = agent.name;
    agentItem.style = `background-color: white; color: black;
    display: flex; align-items: center; padding:6px; justify-content: center;
   margin: 10px 0; cursor: pointer;border-radius: 5px; transition: background-color 0.2s, transform 0.2s; font-size: 12px;width:150px;height:30px;line-height:30px;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);border: 1px solid #d5d5d5;`;

    // Add hover effect

    agentItem.addEventListener("mouseover", () => {
      agentItem.style.backgroundColor = "#f0f0f0"; // Light grey shade for hover effect
      agentItem.style.transform = "scale(1.03)";
      agentsList.style.display = "block"; // Keep the list open
    });
    agentItem.addEventListener("mouseout", () => {
      agentItem.style.backgroundColor = "white"; // Revert to original background color
      agentItem.style.transform = "scale(1)";
    });
    // Click event for agent item
    agentItem.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent event bubbling
      agentsList.style.display = "none"; // Hide the list after selection
      button.style.backgroundColor = "#5D2AC6";
      handleAgentClick(agent); // Define this function to handle the click event
    });

    agentsList.appendChild(agentItem);
  });

  // Append the agents list to the button
  button.appendChild(agentsList);

  // Add the button to the page
  document.body.appendChild(button);
}

let chatBoxVisible = false;

// Create a chat box container
function createChatBox(agent) {
  if (chatBoxVisible) return; // Prevent multiple chat boxes

  // Create the chat box container
  const chatBox = document.createElement("div");
  chatBox.id = "chat-box";
  chatBox.style = `position: fixed; bottom: 70px;
    left: 20px;
    width: 370px;
    height: 500px;
    background-color: rgb(255, 255, 255);
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 30px;
    display: flex;
    flex-direction: column;
    animation: 0.5s ease-in-out 0s 1 normal none running slideUp;
    z-index: 10000;
    margin: 0;
    overflow: hidden;
    padding: 0;`;

  // Add chat box header
  const header = document.createElement("div");
  header.style = `background-color: rgb(93, 42, 198);
    color: rgb(255, 255, 255);
    padding: 10px;
    border-radius: 15px 15px 0px 0px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin: 0;
    width: 100%;`;
  header.textContent = `Chat with ${agent.name}`;
  chatBox.appendChild(header);

  // Create the chat area
  const chatArea = document.createElement("div");
  chatArea.id = "chat-area";
  chatArea.style = `flex-grow: 1;
    overflow-y: auto;
    padding: 0;
    background-color: rgb(249, 249, 249);
    border-radius: 0px 0px 15px 15px;
    max-height: 402px;
    margin: 0;
    box-sizing: border-box;
    width:100%`;

  chatBox.appendChild(chatArea);

  // Create input container
  const inputContainer = document.createElement("div");
  inputContainer.style = `display: flex;
    padding: 0;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    width: 100%;
    position:relative`;

  const textInput = document.createElement("textarea");
  textInput.style = `width: 100%;
    padding: 8px 36px 8px 8px;
    border-top: 1px solid rgb(221, 221, 221);
    resize: none;
    font-size: 14px;
    height: 40px;
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    outline:none`;

  const sendButton = document.createElement("button");
  sendButton.textContent = "Send";
  sendButton.style = `width: 14%;
    height: 98%;
    padding: 8px;
    border: none;
    background-color: rgb(93, 42, 198);
    color: rgb(255, 255, 255);
    font-size: 14px;
    cursor: pointer;
    position: absolute;
    right: 0;
    bottom: 0;
    outline:none`;

  sendButton.addEventListener("click", () => {
    const message = textInput.value.trim();
    if (message) {
      displayMessage("You", message, chatArea);
      textInput.value = ""; // Clear input
      simulateAgentReply(agent, chatArea); // Simulate agent reply
    }
  });

  inputContainer.appendChild(textInput);
  inputContainer.appendChild(sendButton);
  chatBox.appendChild(inputContainer);

  // Close button for chat box
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.style = `position: absolute; top: 10px; right: 10px; background-color: transparent;border: none; color: #fff; font-size: 18px; cursor: pointer;`;

  closeButton.addEventListener("click", () => {
    chatBox.style.display = "none"; // Hide chat box
    chatBoxVisible = false;
  });

  chatBox.appendChild(closeButton);

  // Append chat box to the body
  document.body.appendChild(chatBox);
  chatBoxVisible = true;
}

// Display message in the chat box
function displayMessage(sender, message, chatArea) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = `${sender}: ${message}`;
  messageDiv.style = `background-color: ${sender === "You" ? "#e1f5fe" : "#f1f1f1"};
                     padding: 8px 12px; margin: 0 0 6px 0px; border-radius: 10px; font-size: 14px;`;
  chatArea.appendChild(messageDiv);
  chatArea.scrollTop = chatArea.scrollHeight; // Auto-scroll
}

// Simulate agent's reply
function simulateAgentReply(agent, chatArea) {
  setTimeout(() => {
    const agentMessage = `Hello! How can I assist you today, ${agent.name}?`;
    displayMessage(agent.name, agentMessage, chatArea);
  }, 1000); // Simulate delay
}

// Modify the handleAgentClick function to show the chat box
function handleAgentClick(agent) {
  console.log("handleAgentClick", selectedText);

  createChatBox(agent);
  if (selectedText) {
    saveItem({ type: "text", value: selectedText, agentName: agent.name });
    showToast(`Saved text: "${selectedText}" to agent: ${agent.name}`);
    chrome.runtime.sendMessage({ action: "messageSend", type: "messageSaved", text: selectedText, agentName: agent.name });
    selectedText = ""; // Reset after saving
    // Open chat box
  } else {
    showToast("Please select some text to save.");
  }
}

function saveItem(item) {
  chrome.storage.local.get({ savedItems: [] }, (result) => {
    let savedItems = result.savedItems;
    savedItems.push(item);
    chrome.storage.local.set({ savedItems: savedItems }, () => {
      console.log(`Saved item: ${JSON.stringify(item)}`);
    });
  });
}