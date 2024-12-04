chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true,
  });
});








// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "refreshContextMenu") {
//     console.log("yosuoasf jkg")
//     // Call the execute function when receiving the refresh message
//     execute();
//   }
// });



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("hello");

  setTimeout(() => {
    execute();
    console.log("after 2 seconds")
    
  }, 2000);
});
// latest
let agents = [];

// Fetch agents from chrome.storage.local
// function execute() {
//   console.log("execute function");
//   chrome.storage.local.get(["agents"], (result) => {
//     agents = result.agents || [];
//     console.log(result.agents, "agent in background");

//     if (agents.length > 0) {
//       console.log(agents, "Asdfasdf");
//       console.log(" result.agents", result.agents);
//       // Create context menu items based on agents
//       createContextMenu(agents);

//       // Set up the onClicked listener for the context menu
//       chrome.contextMenus.onClicked.addListener((info, tab) => {
//         // Check if the clicked menu item is an agent
//         if (info.menuItemId.startsWith("agent-")) {
//           const agentIndex = parseInt(info.menuItemId.replace("agent-", ""));
//           const agent = agents[agentIndex];
//           handleAgentClick(agent, info, tab);
//         }
//         // else {
//         //   handleContextMenuClick(info, tab);
//         // }
//       });
//     }
//   });

//   function createContextMenu(agents) {
//     // Remove existing context menus to avoid duplication
//     chrome.contextMenus.removeAll(() => {
//       // Create the parent context menu item
//       chrome.contextMenus.create({
//         id: "agent-menu",
//         title: "Send to the Agent",
//         contexts: ["all"],
//       });

//       // Create a context menu item for each agent
//       agents.forEach((agent, index) => {
//         chrome.contextMenus.create({
//           id: `agent-${index}`,
//           parentId: "agent-menu",
//           title: agent.name, // Display the agent's name
//           contexts: ["all"],
//         });
//       });
//     });
//   }
// }
function execute() {
  console.log("execute function");
  chrome.storage.local.get(["agents"], (result) => {
    const agents = result.agents || [];
    console.log(result.agents, "agent in background");

    // If there are agents, create the context menu
    if (agents.length > 0) {
      console.log(agents, "Asdfasdf");
      console.log(" result.agents", result.agents);
      createContextMenu(agents);

      // Set up the onClicked listener for the context menu
      chrome.contextMenus.onClicked.addListener((info, tab) => {
        // Check if the clicked menu item is an agent
        if (info.menuItemId.startsWith("agent-")) {
          const agentIndex = parseInt(info.menuItemId.replace("agent-", ""));
          const agent = agents[agentIndex];
          handleAgentClick(agent, info, tab);
        }
      });
    } else {
      // If no agents, remove the context menu
      chrome.contextMenus.removeAll(() => {
        console.log("No agents found. Context menu removed.");
      });
    }
  });

  function createContextMenu(agents) {
    // Remove existing context menus to avoid duplication
    chrome.contextMenus.removeAll(() => {
      // Create the parent context menu item
      chrome.contextMenus.create({
        id: "agent-menu",
        title: "Send to the Agent",
        contexts: ["all"],
      });

      // Create a context menu item for each agent
      agents.forEach((agent, index) => {
        chrome.contextMenus.create({
          id: `agent-${index}`,
          parentId: "agent-menu",
          title: agent.name, // Display the agent's name
          contexts: ["all"],
        });
      });
    });
  }
}


function handleAgentClick(agent, info, tab) {
  if (info.selectionText) {
    // Handle selected text
    const selectedText = info.selectionText;
    chrome.tabs.sendMessage(tab.id, { type: "textSave" });
    saveItem({ type: "text", value: selectedText, agentName: agent.name });
  } else if (info.srcUrl) {
    // Handle image URL
    const imageUrl = info.srcUrl;
    chrome.tabs.sendMessage(tab.id, { type: "imageSave" });
    saveItem({ type: "image", value: imageUrl, agentName: agent.name });
  } else {
    chrome.tabs.sendMessage(tab.id, { type: "showError" });
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
