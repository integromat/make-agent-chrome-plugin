  <div
          className="container-fluid"
          ref={dropZoneRef}
          //  onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
                 <Header/>
          <div className="d-flex flex-column" style={{ height: "100vh"}}>
            <div
              className="row d-flex mt-5 justify-content-center align-items-center fixed-top"
              // style={{ backgroundColor: "#F2E8F2" }}
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
                  onClick={() => {
                    setSection("home");
                    setImageSrc("");
                  }}
                >
                  <MdOutlineArrowBack size={25} />
                </span>
              </div>
              <div className="col-6 text-center text-truncate">
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
              {/* <div className="col"></div> */}
              <div className="col text-end">
                <div
                  className="btn btn-white"
                  onClick={() => {
                    // setSection("notes");
                    openModal();
                    loadSavedItems(activeAgency?.name);
                  }}
                >
                  <div>
                  <CgFileDocument size={20}/>
                    
                  </div>
                </div>
              </div>
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
                      <div className="message" style={{position:"relative"}}>
             
                        <div
                          dangerouslySetInnerHTML={{ __html: message.text }}
                        ></div>{" "}
                        {message.type === "receiver" && (
                          <div
                            className="copy-button"
                            style={{ cursor: "pointer",position:"absolute",right:"-30px",bottom:"10px" }}
                            onClick={() => handleCopy(message.text)}
                          >
                            {/* <IoCopyOutline size={20}/> */}
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
                // style={{ backgroundColor: "#F2E8F2" }}
              >
                <div className="form-check ms-1 position-relative">
                  <div className="position-relative">
                    {imageSrc && (
                      <img
                        src={imageSrc || image1} // Use uploaded image if available
                        width="50px"
                        height="50px"
                        alt=""
                        style={{ display: "block", borderRadius: "1rem" }}
                      />
                    )}
                    {imageSrc && (
                      <div
                        className="position-absolute top-0 "
                        style={{ left: "38px", cursor: "pointer" }}
                        onClick={handleResetImage}
                      >
                        <IoIosCloseCircle size={18} />
                      </div>
                    )}
                  </div>
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
                </div>
                <div className="input-container m-1 p-1 relative rounded">
                <label
                    htmlFor="file-upload"
                    className="pin-button"
                    style={{ cursor: "pointer" }}
                  >
                    <MdOutlineAttachFile size={20} />
                  </label>
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Tell Make Agent anything..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
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
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange} // Handle file input change
                  />
                </div>
              </div>
              {/* Overlay */}
              {isOverlayVisible && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999, // Ensure it's above other content
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff",
                      padding: "20px",
                      borderRadius: "10px",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    Drag here
                  </div>
                </div>
              )}
              {/* overlay end */}

              {/* <button className="main-btn m-2 btn btn-primary">
                Save Agent
              </button> */}
            </div>
          </div>
        </div>